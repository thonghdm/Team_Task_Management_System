import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '~/Components/Header';
import Sidebar from '~/Components/Sidebar';
import Dashboard from '~/Components/Dashboard';
import Task from '~/Components/Task';
import Team from '~/Components/Team';
import { Routes, Route } from 'react-router-dom'; // Ensure these imports


const Boards = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar  open={open} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Task />} /> {/* Ensure this matches the Sidebar link */}
          <Route path="/team" element={<Team />} /> {/* Ensure this matches the Sidebar link */}
        </Routes>
      </Box>
    </Box>
  );
};

export default Boards;