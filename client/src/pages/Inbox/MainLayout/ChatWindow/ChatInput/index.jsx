import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SendIcon from '@mui/icons-material/Send';

const ChatInput = () => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <Box
            sx={{
                p: 2,
                borderTop: '1px solid #ddd',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#f7f7f7'
            }}
        >
            <IconButton size="small">
                <EmojiEmotionsOutlinedIcon fontSize="medium" />
            </IconButton>

            <TextField
                variant="outlined"
                placeholder="Message..."
                fullWidth
                size="small"
                value={inputValue}
                onChange={handleInputChange}
                sx={{
                    backgroundColor: '#fff',
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                    }
                }}
            />

            {inputValue === '' ? (
                <>
                    <IconButton size="small">
                        <MicNoneOutlinedIcon fontSize="medium" />
                    </IconButton>

                    <IconButton size="small">
                        <ImageOutlinedIcon fontSize="medium" />
                    </IconButton>

                    <IconButton size="small">
                        <FavoriteBorderOutlinedIcon fontSize="medium" />
                    </IconButton>
                </>
            ) : (
                <IconButton size="small">
                    <SendIcon fontSize="medium" />
                </IconButton>
            )}
        </Box>
    );
};

export default ChatInput;