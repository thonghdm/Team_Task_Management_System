import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from '~/Components/Header';
import Sidebar from '~/Components/Sidebar';
import Homes from '~/pages/Homes';
import Task from '~/pages/Task';
import Team from '~/pages/Team';
import Projects from '~/pages/Projects';
const projectsLinkData = [
  { label: 'Cross-functional project p...', link: 'project1' },
  { label: 'My first portfolio', link: 'project2'},
  { label: 'uijjj', link: 'project3'},
  // Add more projects here to test scrolling
];

const Boards = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
    console.log(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleDrawer={toggleDrawer} />
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Homes />} />
          <Route path="tasks/*" element={<Task />} />
          <Route path="team" element={<Team />} />
          {projectsLinkData.map((project, index) => (
            <Route key={index} path={`board/${project.link}/*`} element={<Projects />} />
          ))}
        </Routes>
      </Box>
    </Box>
  );
};

export default Boards;