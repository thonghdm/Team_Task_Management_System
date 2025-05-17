import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';
import { useParams } from 'react-router-dom';
import { useChat } from '~/Context/ChatProvider';
import SidebarRight from '~/pages/Inbox/MainLayout/SidebarRight';
import { useTheme } from '@mui/material/styles';

const MainLayout = () => {
    const { chatId } = useParams();
    const { fetchMessages } = useChat();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        if (chatId) {
            fetchMessages(chatId);
        }
    }, [chatId, fetchMessages]);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <ChatWindow />
            </Box>
            {isSidebarVisible && (
                <Box sx={{
                    flex: '0 0 30%', borderLeft: `1px solid "#ddd"`
                    , overflowY: 'auto'
                }}>
                    <SidebarRight />
                </Box>
            )}
        </Box>
    );
};

export default MainLayout;
