import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import CallIcon from '@mui/icons-material/Call';
import MissedVideoCallIcon from '@mui/icons-material/MissedVideoCall';
import ReportIcon from '@mui/icons-material/Report';

const ChatHeader = ({ toggleSidebar }) => {
  const { chatId } = useParams();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar sx={{ mr: 2 }}>D</Avatar>
        <Typography variant="h6">{chatId}</Typography>
      </Box>
      <Box>
        <IconButton sx={{ mr: 1 }}>
          <CallIcon />
        </IconButton>
        <IconButton>
          <MissedVideoCallIcon />
        </IconButton>
        <IconButton onClick={toggleSidebar}>
          <ReportIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatHeader;