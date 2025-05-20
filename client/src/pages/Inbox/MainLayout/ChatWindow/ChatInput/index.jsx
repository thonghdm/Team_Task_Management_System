import React, { useState } from 'react';
import { Box, IconButton, InputBase, Paper } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useChat } from '~/Context/ChatProvider';
import { useSelector } from 'react-redux';
import messageApi from '~/apis/chat/messageApi';

const ChatInput = ({ otherUserId }) => {
    const [message, setMessage] = useState('');
    const { sendMessage, currentConversation, setCurrentConversation } = useChat();
    const { userData, accessToken } = useSelector((state) => state.auth);

    const handleSend = async () => {
        if (!message.trim()) return;
        let conversationId = currentConversation;
        console.log('otherUserId:', otherUserId, 'currentConversation:', currentConversation);
        // Nếu chưa có conversation, tạo mới
        if (!conversationId && otherUserId) {
            try {
                const res = await messageApi.createConversation(accessToken, userData._id, otherUserId);
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
                <IconButton sx={{ p: '10px' }}>
                    <AttachFileIcon />
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
                    disabled={!message.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default ChatInput;