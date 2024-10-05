import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const HomeProjectItem = ({ icon, title, subtitle, color, onClick }) => (
  <Button
    onClick={onClick} // Trigger a function when the button is clicked
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 2,
      width: '100%',
      justifyContent: 'flex-start', 
      textTransform: 'none', 
      padding: 1, 
      backgroundColor: 'transparent', 
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
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
        border: '1px dotted white',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
        {title.length > 18 ? `${title.substring(0, 18)}...` : title}
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
