import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChatInput from '~/pages/ChatAI/MainLayout/ChatWindow/ChatInput';
import { chatWithAI } from '~/apis/AI/chatWithAI';

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
      setMessages(prev => [...prev, { text: userPrompt, type: 'prompt' }]);
      const data = await chatWithAI(userPrompt);
      setMessages(prev => [...prev, { text: data, type: 'response' }]);
      setResponse(data);
      setPrompt('');
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        type: 'response'
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
          p: 2,
          overflowY: 'auto',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: message.type === 'prompt' ? 'flex-end' : 'flex-start'
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor:
                    message.type === 'prompt'
                      ? theme.palette.background.paper
                      : theme.palette.primary.main,
                  color: message.type === 'prompt'
                    ? theme.palette.text.primary
                    : theme.palette.primary.contrastText,
                  wordBreak: 'break-word'
                }}
              >
                <Typography variant="body1" component="div">
                  {message.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </Paper>
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
              sx={{
                borderRadius: 2,
                textAlign: 'center',
                backgroundColor: 'transparent',
                p: 2,
                mb: 30,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Ask ChatAI
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
                ChatAI is powered by AI, so mistakes are possible. Review output carefully before use.
              </Typography>
            </Paper>
          </Box>
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{ p: 2, backgroundColor: theme.palette.primary.main }}>
              <Typography>Thinking...</Typography>
            </Paper>
          </Box>
        )}
      </Box>
      <ChatInput onSend={handleSendMessage} />
    </>
  );
};

export default ChatMessages;