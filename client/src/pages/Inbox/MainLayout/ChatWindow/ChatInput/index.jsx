import React, { useState } from 'react';
import { Box, IconButton, InputBase, Paper } from '@mui/material';
import { Send as SendIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import { useChat } from '~/Context/ChatProvider';

const ChatInput = () => {
    const [message, setMessage] = useState('');
    const { sendMessage, currentConversation } = useChat();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim() || !currentConversation) return;

        sendMessage(currentConversation, {
            messageType: 'text',
            content: message.trim()
        });

        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSubmit(e);
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