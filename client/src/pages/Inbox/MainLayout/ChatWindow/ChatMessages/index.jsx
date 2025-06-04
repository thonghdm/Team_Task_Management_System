import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, Avatar, IconButton, Modal, Backdrop } from '@mui/material';
import { 
    InsertDriveFile as FileIcon,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
    Description as DocIcon,
    Archive as ArchiveIcon,
    Download as DownloadIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useChat } from '~/Context/ChatProvider';
import socket from '~/utils/socket';
import { downloadChatFile } from '~/apis/chat/chatFileService';
import { useRefreshToken } from '~/utils/useRefreshToken';
import { toast } from 'react-toastify';

const ChatMessages = () => {
    const theme = useTheme();
    const messagesEndRef = useRef(null);
    const { messages, loading, error, currentConversation, fetchMessages, addMessage } = useChat();
    const { userData } = useSelector((state) => state.auth);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const refreshToken = useRefreshToken();

    // Helper function to get file icon based on mime type
    const getFileIcon = (mimeType, fileName) => {
        if (mimeType?.startsWith('image/')) {
            return <ImageIcon />;
        }
        if (mimeType === 'application/pdf') {
            return <PdfIcon />;
        }
        if (mimeType?.includes('document') || mimeType?.includes('word') || fileName?.endsWith('.doc') || fileName?.endsWith('.docx')) {
            return <DocIcon />;
        }
        if (mimeType?.includes('zip') || mimeType?.includes('rar') || fileName?.endsWith('.zip') || fileName?.endsWith('.rar')) {
            return <ArchiveIcon />;
        }
        return <FileIcon />;
    };

    // Helper function to format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle file download
    const handleFileDownload = async (messageId, fileName) => {
        try {
            let blob;
            try {
                const response = await downloadChatFile(userData.accesstoken, messageId);
                if (!response || !(response instanceof Blob)) {
                    throw new Error('Invalid file data');
                }
                blob = response;
            } catch (error) {
                if (error.response?.status === 401) {
                    // Token expired, try to refresh
                    const newToken = await refreshToken();
                    if (!newToken) {
                        throw new Error('Unable to refresh token');
                    }
                    const response = await downloadChatFile(newToken, messageId);
                    if (!response || !(response instanceof Blob)) {
                        throw new Error('Invalid file data');
                    }
                    blob = response;
                } else {
                    throw error;
                }
            }

            // Kiểm tra kích thước file
            if (blob.size === 0) {
                throw new Error('The file is empty');
            }

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading file:', error);
            if (error.message === 'Unable to refresh token') {
                toast.error('Your session has expired, please log in again.');
            } else if (error.message === 'Invalid file data') {
                toast.error('Unable to read file. File may be corrupted..');
            } else if (error.message === 'The file is empty') {
                toast.error('File is empty or has no data.');
            } else {
                toast.error('Unable to download file. Please try again later..');
            }
        }
    };

    // Helper function to render file message
    const renderFileMessage = (message, isOwnMessage) => {
        const fileData = JSON.parse(message.file);
        const isImage = fileData.mimeType?.startsWith('image/');
        
        if (isImage) {
            // Render image preview
            return (
                <Paper
                    sx={{
                        p: 0,
                        backgroundColor: isOwnMessage ? theme.palette.primary.main : theme.palette.background.paper,
                        borderRadius: 2,
                        maxWidth: 300,
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Box
                            component="img"
                            src={fileData.url}
                            alt={fileData.originalName}
                            sx={{
                                width: '100%',
                                maxHeight: 200,
                                objectFit: 'cover',
                                display: 'block',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setImageUrl(fileData.url);
                                setOpenImageModal(true);
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        {/* Fallback for broken images */}
                        <Box
                            sx={{
                                display: 'none',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 100,
                                bgcolor: theme.palette.grey[200],
                                color: theme.palette.text.secondary
                            }}
                        >
                            <Typography variant="caption">Image not available</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                                display: 'block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {fileData.originalName}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                                opacity: 0.8
                            }}
                        >
                            {formatFileSize(fileData.size)}
                        </Typography>
                    </Box>
                </Paper>
            );
        } else {
            // Render non-image files
            const fileIcon = getFileIcon(fileData.mimeType, fileData.originalName);
            
            return (
                <Paper
                    sx={{
                        p: 1.5,
                        backgroundColor: isOwnMessage ? theme.palette.primary.main : theme.palette.background.paper,
                        color: isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.primary,
                        borderRadius: 2,
                        minWidth: 200,
                        maxWidth: 300
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: isOwnMessage ? 'inherit' : theme.palette.primary.main }}>
                            {fileIcon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    fontWeight: 500,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {fileData.originalName}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {formatFileSize(fileData.size)}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => handleFileDownload(message._id, fileData.originalName)}
                            sx={{ 
                                color: isOwnMessage ? 'inherit' : theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: isOwnMessage 
                                        ? 'rgba(255,255,255,0.1)' 
                                        : 'rgba(0,0,0,0.04)'
                                }
                            }}
                        >
                            <DownloadIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            );
        }
    };

    // Lấy tin nhắn khi đổi cuộc hội thoại (nếu useChat không tự fetch)
    useEffect(() => {
        if (currentConversation && fetchMessages) {
            fetchMessages(currentConversation._id);
        }
    }, [currentConversation]);

    // Lắng nghe socket để nhận tin nhắn mới
    useEffect(() => {
        if (!currentConversation) return;
        const handleNewMessage = (message) => {
            // Nếu message thuộc cuộc hội thoại hiện tại thì thêm vào
            if (message.conversation === currentConversation._id) {
                if (addMessage) {
                    addMessage(message);
                }
            }
        };
        socket.on('new message', handleNewMessage);
        return () => {
            socket.off('new message', handleNewMessage);
        };
    }, [currentConversation, addMessage]);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography>Loading messages...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!currentConversation) {
        return (
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <ChatBubbleOutlineIcon
                    sx={{
                        fontSize: 80,
                        color: theme.palette.text.secondary,
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                    }}
                >
                    Welcome to Inbox
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        maxWidth: 400
                    }}
                >
                    Select a conversation from the sidebar or create a new one to start chatting
                </Typography>
            </Box>
        );
    }

    if (!messages || messages.length === 0) {
        return (
            <Box
                sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <ChatBubbleOutlineIcon
                    sx={{
                        fontSize: 80,
                        color: theme.palette.text.secondary,
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                    }}
                >
                    You have no messages yet.
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        textAlign: 'center',
                        maxWidth: 400
                    }}
                >
                    Start the conversation by sending a message
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
                backgroundColor: theme.palette.background.default,
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Box sx={{ flex: 1 }} /> {/* Spacer để đẩy tin nhắn xuống dưới */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minHeight: 'auto'
                }}
            >
                {messages.map((message, index) => {
                    const isOwnMessage = message.sender._id === userData._id;
                    const showAvatar = !isOwnMessage && (!messages[index - 1] || messages[index - 1].sender._id !== message.sender._id);

                    return (
                        <Box
                            key={message._id}
                            sx={{
                                display: 'flex',
                                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                alignItems: 'flex-end',
                                gap: 1
                            }}
                        >
                            {!isOwnMessage && showAvatar && (
                                <Avatar
                                    src={message.sender.image}
                                    alt={message.sender.displayName}
                                    sx={{ width: 32, height: 32 }}
                                />
                            )}
                            {!isOwnMessage && !showAvatar && <Box sx={{ width: 32 }} />}
                            <Box sx={{ maxWidth: '70%' }}>
                                {!isOwnMessage && showAvatar && (
                                    <Typography variant="caption" sx={{ ml: 1, mb: 0.5 }}>
                                        {message.sender.displayName}
                                    </Typography>
                                )}
                                
                                {/* Render message based on type */}
                                {message.messageType === 'file' ? (
                                    renderFileMessage(message, isOwnMessage)
                                ) : (
                                    <Paper
                                        sx={{
                                            p: 1.5,
                                            backgroundColor: isOwnMessage ? theme.palette.primary.main : theme.palette.background.paper,
                                            color: isOwnMessage ? theme.palette.primary.contrastText : theme.palette.text.primary,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Typography variant="body1">{message.content}</Typography>
                                    </Paper>
                                )}
                                
                                <Typography
                                    variant="caption"
                                    sx={{
                                        mt: 0.5,
                                        display: 'block',
                                        textAlign: isOwnMessage ? 'right' : 'left',
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    {moment(message.createdAt).format('HH:mm')}
                                    {isOwnMessage && message.seenBy && message.seenBy.length > 0 && ' ✓✓'}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>
            <Modal
                open={openImageModal}
                onClose={() => setOpenImageModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' }
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'hidden',
                        boxShadow: 24,
                        outline: 'none'
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        onClick={() => setOpenImageModal(false)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            zIndex: 1,
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt="Full size"
                        style={{ 
                            width: '100%', 
                            height: 'auto', 
                            display: 'block',
                            maxHeight: '80vh'
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default ChatMessages;