import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import MissedVideoCallIcon from '@mui/icons-material/MissedVideoCall';
import ReportIcon from '@mui/icons-material/Report';
import { useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';

const ChatHeader = ({ toggleSidebar }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const handleVideoCall = () => {
    const chatId = "123"; // Truyền ID thực tế của người dùng
    const url = `/call-video?Id=${chatId}`; // Chỉnh sửa đường dẫn
    window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");
  };  


  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar sx={{ mr: 2 }}>D</Avatar>
        <Typography variant="h6">{chatId}</Typography>
      </Box>
      <Box>
        <IconButton sx={{ mr: 1 }} onClick={handleVideoCall}>
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
