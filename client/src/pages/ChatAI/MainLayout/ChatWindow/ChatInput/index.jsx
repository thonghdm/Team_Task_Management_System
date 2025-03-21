import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';

const ChatInput = ({ onSend }) => {
    const [inputValue, setInputValue] = useState('');
    const theme = useTheme();

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            onSend(inputValue);
            setInputValue('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid #ddd',
                borderTop: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <TextField
                variant="outlined"
                placeholder="Message..."
                fullWidth
                size="small"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                sx={{
                    backgroundColor: theme.palette.background.default,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                    },
                }}
            />

            {inputValue && (
                <IconButton size="small" onClick={handleSubmit}>
                    <SendIcon fontSize="medium" />
                </IconButton>
            )}
        </Box>
    );
};

export default ChatInput;