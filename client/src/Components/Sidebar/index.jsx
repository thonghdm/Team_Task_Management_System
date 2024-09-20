import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItemSide from '~/Components/ItemsSide/ListItemSide';
const Sidebar = ({ isOpen, toggleNav, width, collapsedWidth }) => (
  <Box
    sx={{
      width: isOpen ? `${width}px` : `${collapsedWidth}px`,
      backgroundColor: 'blue',
      color: 'white',
      transition: 'width 0.3s',
      position: 'relative',
    }}
  >
    <Box sx={{ overflow: 'hidden' }}>
      <Box sx={{ width: `${width}px`, padding: 2, overflow: 'hidden' }}>
        <Typography>navs</Typography>

        <Box sx={{'&:hover': {
          backgroundColor: 'darkblue'}}}>
          <ListItemSide iconName="chevronLeft" titlePlan="Plan" toggleNav={toggleNav} />
        </Box>

        <Box sx={{'&:hover': {
          backgroundColor: 'darkblue'}}}>
          <ListItemSide iconName="chevronLeft" titlePlan="Plan" toggleNav={toggleNav} />
        </Box>

        <Box sx={{'&:hover': {
          backgroundColor: 'darkblue'}}}>
          <ListItemSide iconName="chevronLeft" titlePlan="Plan" toggleNav={toggleNav} />
        </Box>
      </Box>
    </Box>
    <IconButton
      sx={{
        position: 'absolute',
        right: isOpen ? 0 : `-${collapsedWidth}px`,
        top: 0,
        color: 'white',
        display: 'flex',
        backgroundColor: 'blue',
        '&:hover': {
          backgroundColor: 'darkblue',
        },
      }}
      onClick={toggleNav}
    >
      {isOpen ? (
        <ChevronLeftIcon sx={{ fontSize: 30 }} />
      ) : (
        <ArrowForwardIosIcon sx={{ fontSize: 18, overflow: 'visible', }} />
      )}

      
    </IconButton>

  </Box>
);

export default Sidebar;