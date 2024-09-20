import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '~/Components/Header';
import Sidebar from '~/Components/Sidebar';
import Content from '~/Components/Content';

const DashBoard = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const navWidth = 250;
  const collapsedNavWidth = 10;

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header toggleNav={toggleNav} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <Sidebar 
          isOpen={isNavOpen} 
          toggleNav={toggleNav} 
          width={navWidth} 
          collapsedWidth={collapsedNavWidth} 
        />
        <Content 
          isNavOpen={isNavOpen} 
          navWidth={navWidth} 
          collapsedNavWidth={collapsedNavWidth} 
        />
      </Box>
    </Box>
  );
};

export default DashBoard;