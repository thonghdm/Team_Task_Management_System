import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Team = () => (
  <Box
    sx={{
      flexGrow: 1,
      p: 3,
      mt: '64px',
    }}
  >
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 100px)' }}>
      <Typography variant="h4" gutterBottom>
      Team
      </Typography>
      <Typography paragraph>
        Welcome to your Team. This is where you can add your main content, widgets, charts, or any other dashboard elements.
      </Typography>
    </Paper>
  </Box>
);

export default Team;