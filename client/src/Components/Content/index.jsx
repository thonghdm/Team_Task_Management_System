import React from 'react';
import { Box, Typography } from '@mui/material';

const Content = ({ isNavOpen, navWidth, collapsedNavWidth }) => (
  <Box 
    sx={{ 
      flexGrow: 1, 
      backgroundColor: 'gray', 
      padding: 2,
      transition: 'width 0.3s',
      width: `calc(100% - ${isNavOpen ? navWidth : collapsedNavWidth}px)`,
    }}
  >
    <Typography>content</Typography>
  </Box>
);


export default Content;