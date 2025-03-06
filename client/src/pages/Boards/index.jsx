// Boards.js
import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '~/Components/Header';
import Sidebar from '~/Components/Sidebar';
import Homes from '~/pages/Homes';
import Task from '~/pages/Task';
import Team from '~/pages/Team';
import Projects from '~/pages/Projects';
// import AddProjects from '~/pages/Projects/AddProjects';
import Inbox from '~/pages/Inbox';
import PaymentError from '~/pages/Payment/PaymentError';
import PaymentSuccess from '~/pages/Payment/PaymentSuccess';

import ChatAI from '~/pages/ChatAI';
const Boards = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1}}>
        <Routes>
          <Route index element={<Navigate to="home/1" replace />} />
          <Route path="home/1" element={<Homes />} />
          <Route path="tasks/1/*" element={<Task />} />
          <Route path="team/4" element={<Team />} />
          <Route path="inbox/1/*" element={<Inbox />} />
          <Route path="chat-ai/1/*" element={<ChatAI />} />
          {/* <Route path="/projects/new" element={<AddProjects />} /> */}
          <Route path=":projectId/2/*" element={<Projects />} />
          <Route path=":projectId/3/*" element={<Projects />} />

          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/error" element={<PaymentError/>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Boards;