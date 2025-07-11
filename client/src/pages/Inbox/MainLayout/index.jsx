import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import ChatWindow from './ChatWindow';
import { useParams } from 'react-router-dom';
import { useChat } from '~/Context/ChatProvider';
import SidebarRight from '~/pages/Inbox/MainLayout/SidebarRight';
import { useTheme } from '@mui/material/styles';

const MainLayout = ({ setSelectedUserIdRef }) => {
    const { chatId } = useParams();
    const { fetchMessages } = useChat();
    const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
    const [selectedUserId, setSelectedUserId] = React.useState(null);
    const theme = useTheme();

    useEffect(() => {
        if (chatId && fetchMessages) {
            fetchMessages(chatId);
        }
    }, [chatId, fetchMessages]);

    useEffect(() => {
        if (setSelectedUserIdRef) {
            setSelectedUserIdRef.current = setSelectedUserId;
        }
    }, [setSelectedUserIdRef]);

    const toggleSidebar = () => {
        setIsSidebarVisible((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarVisible(false);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <ChatWindow toggleSidebar={toggleSidebar} selectedUserId={selectedUserId} />
            </Box>
            {isSidebarVisible && (
                <Box sx={{
                    flex: '0 0 30%', 
                    borderLeft: `1px solid ${theme.palette.divider}`,
                    overflowY: 'auto'
                }}>
                    <SidebarRight setSelectedUserId={setSelectedUserId} onClose={closeSidebar} />
                </Box>
            )}
        </Box>
    );
};

export default MainLayout;
