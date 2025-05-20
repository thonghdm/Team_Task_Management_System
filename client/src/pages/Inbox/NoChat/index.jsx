import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const NoChat = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.background.default
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    padding: 4,
                    textAlign: 'center',
                    backgroundColor: 'transparent'
                }}
            >
                <ChatBubbleOutlineIcon
                    sx={{
                        fontSize: 80,
                        color: theme.palette.text.secondary,
                        marginBottom: 2
                    }}
                />
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary,
                        marginBottom: 1
                    }}
                >
                    No Chat Selected
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 400
                    }}
                >
                    Select a conversation from the sidebar to start chatting or create a new conversation to connect with others.
                </Typography>
            </Paper>
        </Box>
    );
};

export default NoChat;