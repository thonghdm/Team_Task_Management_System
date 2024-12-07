import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from '~/pages/Admin/Header';
import Sidebar from '~/pages/Admin/Sidebar';
import Users from '~/pages/Admin/Users';
import DashBoards from '~/pages/Admin/DashBoards';
import Projects from '~/pages/Admin/Projects';
import ChangePassword from '~/pages/Admin/ChangePassword';
import Profile from '~/pages/Profile'

import AddUserButton from '~/pages/Admin/Users/AddUserButton';
import AddUserFile from '~/pages/Admin/Users/AddUserFile';
const Admin = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route index element={<Navigate to="users/101" replace />} />
          <Route path="users/101" element={<Users />} />
          <Route path="users/101/edit-user/:id" element={<Profile />} />
          <Route path="users/101/add-user" element={<AddUserButton />} />
          <Route path="users/101/add-user-file" element={<AddUserFile />} />

          <Route path="dashboards/101" element={<DashBoards />} />
          <Route path="projects/101" element={<Projects />} />
          <Route path="change-password/101" element={<ChangePassword />} />
        </Routes>
      </Box>
    </Box>
  )
};

export default Admin;