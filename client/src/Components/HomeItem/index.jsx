import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const HomeItem = ({ task, date, color}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,pb:1}}>
      <CheckCircleOutlineIcon sx={{ color: color, mr: 1 }} />
      <Typography sx={{ flexGrow: 1 }}>{task}</Typography>
      <Chip label="Cross-fu..." size="small" sx={{ backgroundColor: '#6aa84f', color: 'white', mr: 1 }} />
      <Typography variant="body2" sx={{ color: '#aaa' }}>
        {date}
      </Typography>
    </Box>
  );
};

export default HomeItem;
