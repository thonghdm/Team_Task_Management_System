import React, { useState } from 'react';
import { Box, IconButton, InputBase, Paper } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useChat } from '~/Context/ChatProvider';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import messageApi from '~/apis/chat/messageApi';
import { uploadChatFileThunk } from '~/redux/chat/chatFile-slice';
import { useRefreshToken } from '~/utils/useRefreshToken';
import { validateChatFile } from '~/utils/fileValidation';

const ChatInput = ({ otherUserId }) => {
    const [message, setMessage] = useState('');
    const { sendMessage, currentConversation, setCurrentConversation } = useChat();
    const { userData, accesstoken } = useSelector((state) => state.auth);
    const { uploadingFile } = useSelector((state) => state.chatFile || { uploadingFile: false });
    const dispatch = useDispatch();
    const refreshToken = useRefreshToken();

    const handleSend = async () => {
        if (!message.trim()) return;
        let conversationId = currentConversation;
        console.log('otherUserId:', otherUserId, 'currentConversation:', currentConversation);
        // Nếu chưa có conversation, tạo mới
        if (!conversationId && otherUserId) {
            try {
                const res = await messageApi.createConversation(accesstoken, userData._id, otherUserId);
                conversationId = res._id;
                setCurrentConversation(conversationId);
            } catch (err) {
                alert('Không thể tạo cuộc trò chuyện');
                return;
            }
        }
        if (!conversationId) return;
        sendMessage(conversationId, {
            messageType: 'text',
            content: message.trim()
        });
        setMessage('');
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        
        // Validate file before proceeding using utility function
        const validation = validateChatFile(file);
        if (!validation.isValid) {
            // Reset file input on validation failure
            event.target.value = '';
            return;
        }

        let conversationId = currentConversation;
        
        // Nếu chưa có conversation, tạo mới
        if (!conversationId && otherUserId) {
            try {
                const res = await messageApi.createConversation(accesstoken, userData._id, otherUserId);
                conversationId = res._id;
                setCurrentConversation(conversationId);
            } catch (err) {
                toast.error('Unable to create conversation');
                event.target.value = '';
                return;
            }
        }

        if (!conversationId) {
            toast.error('Please select a conversation');
            event.target.value = '';
            return;
        }

        // Ensure conversationId is a string, not an object
        const conversationIdString = typeof conversationId === 'object' && conversationId._id 
            ? conversationId._id 
            : conversationId;

        const fileData = {
            file: file,
            conversationId: conversationIdString,
            uploadedBy: userData._id
        };

        console.log('fileData before upload:', fileData);

        const uploadFileToChat = async (accesstoken) => {
            console.log('accesstoken:', accesstoken);
            try {
                // Show loading toast
                const loadingToast = toast.loading(`Uploading "${file.name}"...`);
                
                const resultAction = await dispatch(uploadChatFileThunk({ 
                    accessToken: accesstoken, 
                    fileData 
                }));
                
                // Dismiss loading toast
                toast.dismiss(loadingToast);
                
                if (uploadChatFileThunk.rejected.match(resultAction)) {
                    if (resultAction.payload?.err === 2) {
                        const newToken = await refreshToken();
                        return uploadFileToChat(newToken);
                    }
                    throw new Error('File upload failed');
                }
                
                toast.success(`File "${file.name}" uploaded successfully`);
                // Reset file input
                event.target.value = '';
            } catch (error) {
                toast.error(`Failed to upload file: ${error.message}`);
                console.error('Upload error:', error);
                // Reset file input on error
                event.target.value = '';
            }
        };

        uploadFileToChat(accesstoken);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('otherUserId:', otherUserId, 'currentConversation:', currentConversation);
        handleSend();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSend();
        }
    };

    return (
        <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
            <Paper
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 2
                }}
            >
                <IconButton 
                    sx={{ p: '10px' }} 
                    component="label" 
                    disabled={uploadingFile}
                >
                    <AttachFileIcon />
                    <input
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                        accept=".jpeg,.jpg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.txt,.pptx"
                    />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Type a message"
                    multiline
                    maxRows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <IconButton 
                    type="submit" 
                    sx={{ p: '10px' }}
                    disabled={!message.trim() || uploadingFile}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default ChatInput;