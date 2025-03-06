import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatHeader from '~/pages/ChatAI/MainLayout/ChatWindow/ChatHeader';
import ChatMessages from '~/pages/ChatAI/MainLayout/ChatWindow/ChatMessages';

// const ChatWindow = ({ toggleSidebar }) => {
const ChatWindow = () => {
    const [resetMessages, setResetMessages] = useState(false);
    const handleToggleSidebar = () => {
        setResetMessages(true);
        toggleSidebar();
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* <ChatHeader toggleSidebar={toggleSidebar} /> */}
            <ChatHeader toggleSidebar={handleToggleSidebar} />
            <ChatMessages resetMessages={resetMessages} setResetMessages={setResetMessages} />
        </Box>
    );
}

export default ChatWindow;
