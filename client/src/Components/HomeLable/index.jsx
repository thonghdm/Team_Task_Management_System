import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';

const HomeLable = ({lable}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{lable}</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ color: 'white' }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>
  );
};

export default HomeLable;
