import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Avatar, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatInput from '~/pages/ChatAI/MainLayout/ChatWindow/ChatInput';
import { chatWithAI } from '~/apis/AI/chatWithAI';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const ChatMessages = ({ resetMessages, setResetMessages }) => {
  const theme = useTheme();
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chatContainer = document.querySelector('.scrollable');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]); 
  
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (resetMessages) {
        setMessages([]);
        localStorage.removeItem('chatMessages');
        setResetMessages(false);
    }
}, [resetMessages, setResetMessages]);

  const handleSendMessage = async (userPrompt) => {
    try {
      setLoading(true);
      const timestamp = new Date().toISOString();
      setMessages(prev => [...prev, { 
        text: userPrompt, 
        type: 'prompt',
        timestamp 
      }]);
      const data = await chatWithAI(userPrompt);
      setMessages(prev => [...prev, { 
        text: data, 
        type: 'response',
        timestamp: new Date().toISOString()
      }]);
      setResponse(data);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        type: 'response',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        className="scrollable"
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: 'auto',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.paper,
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: '4px',
          },
        }}
      >
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
                flexDirection: message.type === 'prompt' ? 'row-reverse' : 'row',
                animation: 'fadeIn 0.3s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: message.type === 'prompt' 
                    ? theme.palette.primary.main 
                    : theme.palette.secondary.main,
                  width: 36,
                  height: 36,
                }}
              >
                {message.type === 'prompt' ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              <Box sx={{ maxWidth: '70%' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: message.type === 'prompt'
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                    color: message.type === 'prompt'
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                    wordBreak: 'break-word',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '12px',
                      [message.type === 'prompt' ? 'right' : 'left']: '-8px',
                      width: '16px',
                      height: '16px',
                      backgroundColor: message.type === 'prompt'
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                      transform: 'rotate(45deg)',
                      zIndex: 0,
                    },
                  }}
                >
                  <Typography variant="body1" component="div" sx={{ position: 'relative', zIndex: 1 }}>
                    {message.text.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </Typography>
                </Paper>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block',
                    mt: 0.5,
                    color: theme.palette.text.secondary,
                    textAlign: message.type === 'prompt' ? 'right' : 'left',
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              flexGrow: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                textAlign: 'center',
                backgroundColor: 'transparent',
                p: 4,
                maxWidth: '600px',
                mx: 'auto',
                border: `2px dashed ${theme.palette.divider}`,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: theme.palette.primary.main,
                  mb: 2,
                  mx: 'auto',
                }}
              >
                <SmartToyIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: theme.palette.primary.main }}>
                Welcome to ChatAI
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2, maxWidth: '400px', mx: 'auto' }}>
                I'm your AI assistant. I can help you with various tasks, answer questions, and engage in meaningful conversations.
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                Powered by advanced AI technology. Please review responses carefully.
              </Typography>
            </Paper>
          </Box>
        )}
        {loading && (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
              ml: 7,
              animation: 'fadeIn 0.3s ease-in-out',
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                width: 36,
                height: 36,
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Paper 
              elevation={1}
              sx={{ 
                p: 2, 
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <CircularProgress size={16} thickness={4} />
              <Typography>AI is thinking...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
      <ChatInput onSend={handleSendMessage} />
    </>
  );
};

export default ChatMessages;