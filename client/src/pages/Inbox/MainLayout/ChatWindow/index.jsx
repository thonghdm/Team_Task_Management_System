import React from 'react';
import { Box } from '@mui/material';
import ChatHeader from '~/pages/Inbox/MainLayout/ChatWindow/ChatHeader';
import ChatMessages from '~/pages/Inbox/MainLayout/ChatWindow/ChatMessages';
import ChatInput from '~/pages/Inbox/MainLayout/ChatWindow/ChatInput';

const ChatWindow = ({ toggleSidebar }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ChatHeader toggleSidebar={toggleSidebar} />
            <ChatMessages />
            <ChatInput />
        </Box>
    );
}

export default ChatWindow;
