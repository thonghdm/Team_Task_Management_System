import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatWindow from '~/pages/ChatAI/MainLayout/ChatWindow';
import { useTheme } from '@mui/material/styles';
import ChatSidebar from '../ChatSidebar';

const MainLayout = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const theme = useTheme();

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    return (
        <Box sx={{ display: 'flex', height: '87vh' }}>
            <Box sx={{ flex: isSidebarVisible ? '0 0 70%' : '0 0 100%', display: 'flex', flexDirection: 'column' }}>
                {/* <ChatWindow toggleSidebar={toggleSidebar} /> */}
                <ChatWindow />
            </Box>
            {isSidebarVisible && (
                <Box sx={{
                    flex: '0 0 30%', borderLeft: `1px solid "#ddd"`
                    , overflowY: 'auto'
                }}>
                    <ChatSidebar />
                </Box>
            )}
        </Box>
    );
};

export default MainLayout;
