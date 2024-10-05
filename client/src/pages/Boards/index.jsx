import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '~/Components/Header';
import Sidebar from '~/Components/Sidebar';
import Dashboard from '~/Components/Dashboard';
import Task from '~/pages/Task';
import Team from '~/pages/Team';
import Home from '~/pages/Homes';
import { Routes, Route } from 'react-router-dom'; // Ensure these imports


const Boards = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
    console.log(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar  open={open} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/team" element={<Team />} /> 
        </Routes>
      </Box>
    </Box>
  );
};

export default Boards;