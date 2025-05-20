import React, { useRef } from 'react';
import { Box, Paper, Grid } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import ChatSidebar from './ChatSidebar';
import MainLayout from './MainLayout';
import { useTheme } from '@mui/material/styles';
import { useChat } from '~/Context/ChatProvider';

const Inbox = () => {
    const theme = useTheme();
    const { messages, loading, error } = useChat();
    // Tạo ref để lưu setSelectedUserId
    const setSelectedUserIdRef = useRef(null);

    // Kiểm tra xem chat context có hoạt động không
    console.log('Chat context in Inbox:', { messages, loading, error });

    return (
        <Box sx={{ flexGrow: 1, p: 2, mt: '64px', backgroundColor: theme.palette.background.paper }}>
            <Paper elevation={3} sx={{ height: 'calc(100vh - 96px)', overflow: 'hidden' }}>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={3} sx={{ borderRight: '1px solid #ddd', backgroundColor: theme.palette.background.default }}>
                        <ChatSidebar setSelectedUserId={userId => {
                            if (setSelectedUserIdRef.current) setSelectedUserIdRef.current(userId);
                        }} />
                    </Grid>
                    <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
                        <Routes>
                            <Route path="/*" element={<MainLayout setSelectedUserIdRef={setSelectedUserIdRef} />} />
                        </Routes>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Inbox;
