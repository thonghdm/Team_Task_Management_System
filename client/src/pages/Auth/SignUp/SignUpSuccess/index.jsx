import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SignUpSuccess = () => {
    const navigate = useNavigate();
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
            backgroundColor: '#1a1a2e',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            padding: '20px'
        }}>
            <Box sx={{
                backgroundColor: '#252540',
                padding: '30px',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <Typography variant="h4" sx={{ marginBottom: '20px' }}>
                    Registration Successful!
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: '20px' }}>
                    Your account has been successfully created.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoToDashboard}>
                    Go to Dashboard
                </Button>
            </Box>
        </Box>
    );
};

export default SignUpSuccess;