// Header.js
import React from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleGoBack = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate(-1);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                p: 2,
                position: 'absolute',
                top: 0,
                bgcolor: 'background.pager',
            }}
        >
            <IconButton onClick={handleGoBack}>
                <ArrowBackIcon />
            </IconButton>
        </Box>
    );
};

export default Header;
