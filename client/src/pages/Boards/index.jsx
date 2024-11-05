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
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Homes />} />
          <Route path="tasks/*" element={<Task />} />
          <Route path="team" element={<Team />} />
          <Route path="inbox/*" element={<Inbox />} />
          {/* <Route path="/projects/new" element={<AddProjects />} /> */}
          <Route path=":projectId/*" element={<Projects />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Boards;