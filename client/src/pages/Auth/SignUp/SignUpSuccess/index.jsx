import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SignUpSuccess = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const location = useLocation();
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/error');
        }
    }, [email, navigate]);

    const handleGoToDashboard = () => {
        navigate('/');
    };

    return (
        <Box sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '20px'
        }}>
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '30px',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                border: `1px solid ${theme.palette.divider}`,
            }}>
                <Typography variant="h4" sx={{ color: theme.palette.success.light, marginBottom: '20px', fontWeight: 'bold' }}>
                    Registration Successful!
                </Typography>
                <Typography variant="body1" sx={{ color: theme.palette.success.light, marginBottom: '20px' }}>
                    Your account has been successfully created.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoToDashboard}>
                    Go to Login
                </Button>
            </Box>
        </Box>
    );
};

export default SignUpSuccess;