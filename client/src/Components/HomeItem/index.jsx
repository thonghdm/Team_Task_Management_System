import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@mui/material/styles';

const HomeItem = ({ task, date, color}) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,pb:1}}>
      <CheckCircleOutlineIcon sx={{ color: color, mr: 1 }} />
      <Typography sx={{ flexGrow: 1 }}>{task}</Typography>
      <Chip label="Cross-fu..." size="small" sx={{ backgroundColor: '#6aa84f', color: theme.palette.text.primary, mr: 1 }} />
      <Typography variant="body2" sx={{ color: '#aaa' }}>
        {date}
      </Typography>
    </Box>
  );
};

export default HomeItem;
