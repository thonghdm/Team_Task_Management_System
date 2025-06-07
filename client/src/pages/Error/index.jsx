import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Box, Typography, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import styled from '@emotion/styled';
import actionTypes from '~/redux/actions/actionTypes';
import {
    AuthCard,
    StyledButton,
    GradientTypography,
    getTextColor,
} from '~/shared/styles/commonStyles';

const AuthContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(245, 245, 245, 0.95)',
    padding: theme.spacing(2),
}));

const ErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
    fontSize: '80px',
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
            opacity: 1,
        },
        '50%': {
            transform: 'scale(1.1)',
            opacity: 0.8,
        },
        '100%': {
            transform: 'scale(1)',
            opacity: 1,
        },
    },
}));

const Error = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleBackToHome = () => {
        dispatch({
            type: actionTypes.LOGOUT,
        });
        navigate('/sign-in');
    };

    return (
        <AuthContainer>
            <AuthCard>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <ErrorIcon />
                    <GradientTypography
                        component="h1"
                        variant="h4"
                        sx={{ mb: 2 }}
                    >
                        Oops! Something went wrong
                    </GradientTypography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                            ...getTextColor(theme),
                            maxWidth: '400px',
                        }}
                    >
                        We apologize, but it seems you've reached this page in error. 
                        This could be due to an expired session or an invalid request.
                    </Typography>
                    <StyledButton
                        variant="contained"
                        onClick={handleBackToHome}
                        sx={{ minWidth: '200px' }}
                    >
                        Back to Sign In
                    </StyledButton>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};

export default Error;