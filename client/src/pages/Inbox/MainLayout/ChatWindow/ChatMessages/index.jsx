import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import {useMessageScroll} from '~/hooks/useMessageScroll';
const messages = [
  { text: 'Hi, how are you?', time: '11:00', sender: 'other' },
  { text: "I'm good, thanks!", time: '12:00', sender: 'self' },
  { text: 'Hi, how are you?', time: '11:00', sender: 'other' },
  { text: "I'm good, thanks!", time: '12:00', sender: 'self' },
  {
    text: 'Hi, how are you?'.repeat(10),
    time: '11:00',
    sender: 'other'
  },
  {
    text: "I'm good, thanks!".repeat(10),
    time: '12:00',
    sender: 'self'
  },
  {
    text: "I'm good, thanks!".repeat(10),
    time: '12:00',
    sender: 'self'
  },
  {
    text: "I'm good, thanks!".repeat(10),
    time: '12:00',
    sender: 'self'
  },
  { text: "I'm good, thanks!", time: '12:00', sender: 'self' },
  { text: "I'm good, thanks!", time: '12:00', sender: 'self' },
];

const ChatMessages = () => {
  const theme = useTheme();
//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages.length]);

  return (
    <Box
      className="scrollable"
      sx={{
        flexGrow: 1,
        p: 2,
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default
      }}
      ref={chatContainerRef}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: message.sender === 'self' ? 'flex-end' : 'flex-start'
          }}
        >
          <Paper
            sx={{
              p: 1,
              maxWidth: '70%',
              mb: 1,
              borderRadius: 2,
              backgroundColor:
                message.sender === 'self'
                  ? theme.palette.primary.main
                  : theme.palette.background.paper,
              wordBreak: 'break-word'
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
            <Typography sx={{ fontSize: '12px' }} color="textSecondary">
              {message.time}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ChatMessages;