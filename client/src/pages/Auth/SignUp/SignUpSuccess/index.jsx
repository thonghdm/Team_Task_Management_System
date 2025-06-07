import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from '@emotion/styled';
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

const SuccessIcon = styled(CheckCircleOutlineIcon)(({ theme }) => ({
    fontSize: '80px',
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
    animation: 'scaleIn 0.5s ease-out',
    '@keyframes scaleIn': {
        '0%': {
            transform: 'scale(0)',
            opacity: 0,
        },
        '50%': {
            transform: 'scale(1.2)',
            opacity: 0.8,
        },
        '100%': {
            transform: 'scale(1)',
            opacity: 1,
        },
    },
}));

const SuccessMessage = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(46, 125, 50, 0.1)'
        : 'rgba(46, 125, 50, 0.05)',
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(3),
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
        '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
        },
        '100%': {
            opacity: 1,
            transform: 'translateY(0)',
        },
    },
}));

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

    const handleGoToLogin = () => {
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
                    <SuccessIcon />
                    <GradientTypography
                        component="h1"
                        variant="h4"
                        sx={{ mb: 2 }}
                    >
                        Registration Successful!
                    </GradientTypography>
                    <SuccessMessage>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 1,
                                color: theme.palette.success.main,
                                fontWeight: 500,
                            }}
                        >
                            Your account has been successfully created
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                ...getTextColor(theme),
                                opacity: 0.8,
                            }}
                        >
                            Welcome to our community! You can now sign in with your email:
                            <Typography
                                component="span"
                                sx={{
                                    display: 'block',
                                    color: theme.palette.primary.main,
                                    fontWeight: 500,
                                    mt: 0.5,
                                }}
                            >
                                {email}
                            </Typography>
                        </Typography>
                    </SuccessMessage>
                    <StyledButton
                        variant="contained"
                        onClick={handleGoToLogin}
                        sx={{ minWidth: '200px' }}
                    >
                        Continue to Sign In
                    </StyledButton>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
};

export default SignUpSuccess;