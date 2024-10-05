import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HomeProjectItem = ({ icon, title, subtitle, color, onClick }) => (
  <Button
    onClick={onClick} // Trigger a function when the button is clicked
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      width: '100%', // Makes the button take the full width of the container
      justifyContent: 'flex-start', // Align items to the start
      textTransform: 'none', // Prevent uppercase transformation
      padding: 1, // Add padding for better click area
      backgroundColor: 'transparent', // Optional: to maintain a transparent background
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Change background on hover
      },
    }}
  >
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: 2,
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mr: 2,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ color: 'white' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: '#aaa' }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  </Button>
);

export default HomeProjectItem;
