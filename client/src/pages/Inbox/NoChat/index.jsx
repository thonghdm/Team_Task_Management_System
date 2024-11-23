import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const NoChat = () => (
  <Box
    sx={{
      flexGrow: 1,
    }}
  >
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 100px)' }}>
      <Typography variant="h4" gutterBottom>
      No-chat
      </Typography>
      
    </Paper>
  </Box>
);

export default NoChat;