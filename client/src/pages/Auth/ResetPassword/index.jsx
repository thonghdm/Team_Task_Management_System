import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { CircularProgress, useTheme } from '@mui/material';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';
import { resetPassword } from '~/redux/actions/authAction';
import styled from '@emotion/styled';
import {
    AuthCard,
    StyledTextField,
    StyledButton,
    GradientTypography,
    getTextColor,
} from '~/shared/styles/commonStyles';
import { Link } from '@mui/material';

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

const LoadingOverlay = styled(Box)(({ theme }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(18, 18, 18, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));

export default function ResetPassword() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsSignedUp } = useAuth();

    const typeOtp = 0;
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [isSendOTP, setIsSendOTP] = useState(false);

    const validateEmail = () => {
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');
        setIsSendOTP(true);

        if (validateEmail()) {
            try {
                const res = await dispatch(resetPassword(email));
                setIsSignedUp(true);
                if (res.success) {
                    navigate('/otp', { state: { email, typeOtp } });
                } else {
                    setGeneralError(res.message || 'Failed to send reset email. Please try again.');
                }
            } catch (error) {
                setGeneralError(error.message || 'Failed to send reset email. Please try again.');
            } finally {
                setIsSendOTP(false);
            }
        } else {
            setIsSendOTP(false);
        }
    };

    return (
        <>
            {isSendOTP && (
                <LoadingOverlay>
                    <CircularProgress size={60} />
                    <Typography
                        variant="h6"
                        sx={{
                            mt: 2,
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                        }}
                    >
                        Sending OTP to your email...
                    </Typography>
                </LoadingOverlay>
            )}
            <AuthContainer>
                <AuthCard>
                    <GradientTypography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}
                    >
                        Reset Password
                    </GradientTypography>
                    <Typography
                        variant="body1"
                        sx={{
                            textAlign: 'center',
                            mb: 3,
                            ...getTextColor(theme),
                        }}
                    >
                        Enter your email address and we'll send you a code to reset your password
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <StyledTextField
                                error={!!emailError}
                                helperText={emailError}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                required
                                autoFocus
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        {generalError && (
                            <Typography
                                color="error"
                                variant="body2"
                                sx={{
                                    textAlign: 'center',
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? 'rgba(211, 47, 47, 0.1)'
                                        : 'rgba(211, 47, 47, 0.05)',
                                    padding: theme.spacing(1),
                                    borderRadius: theme.shape.borderRadius,
                                }}
                            >
                                {generalError}
                            </Typography>
                        )}
                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSendOTP}
                        >
                            {isSendOTP ? 'Sending...' : 'Send Reset Link'}
                        </StyledButton>
                        <Typography
                            sx={{
                                textAlign: 'center',
                                mt: 2,
                                ...getTextColor(theme),
                            }}
                        >
                            Remember your password?{' '}
                            <Link
                                href="/sign-in"
                                sx={{
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </AuthCard>
            </AuthContainer>
        </>
    );
}