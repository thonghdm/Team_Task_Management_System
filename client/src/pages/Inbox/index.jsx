import React from 'react';
import { Box, Paper, Grid } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';

import ChatSidebar from '~/pages/Inbox/ChatSidebar';
import MainLayout from './MainLayout';
import NoChat from '~/pages/Inbox/NoChat';
const Inbox = () => {
    // Sample chat items array
    const chatItems = [
        { id: 1, name: "Hoang Dinh Minh Thong", message: "Last message preview", initials: "HT" },
        { id: 2, name: "Dien", message: "Hello, how are you?", initials: "DL" },
        { id: 3, name: "Lonâg", message: "Meeting at 10AM", initials: "AL" },
    ];

    return (
        <Box sx={{ flexGrow: 1, p: 2, mt: '64px', backgroundColor: '#f0f2f5' }}>
            <Paper elevation={3} sx={{ height: 'calc(100vh - 96px)', overflow: 'hidden' }}>
                <Grid container sx={{ height: '100%' }}>
                    <Grid item xs={3} sx={{ borderRight: '1px solid #ddd', backgroundColor: '#fff' }}>
                        {chatItems.length>0&&<ChatSidebar chatItems={chatItems} />}
                    </Grid>
                    <Grid item xs={9} sx={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
                    <Routes>
                            {chatItems.length > 0 ? (
                                <Route path="/" element={<Navigate to={`${chatItems[0].id}`} replace />} />
                            ) : (
                                <Route path="/" element={<Navigate to="/board/inbox/no-chats" replace />} />
                            )}
                            <Route path=":chatId" element={<MainLayout />} />
                            <Route path="no-chats" element={<NoChat/>}/>
                        </Routes>
                    </Grid>
                </Grid>
            </Paper>
            
        </Box>
    );
};

export default Inbox;
