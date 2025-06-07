import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';
import axios from 'axios';
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

const OTPInput = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    justifyContent: 'center',
    '& input': {
        width: '40px !important',
        height: '40px !important',
        textAlign: 'center',
        fontSize: '1.5rem',
        fontWeight: 600,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        border: `1px solid ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'}`,
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.2s ease-in-out',
        '&:focus': {
            borderColor: theme.palette.primary.main,
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
            outline: 'none',
        },
        '&:hover': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const SuccessMessage = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(46, 125, 50, 0.1)'
        : 'rgba(46, 125, 50, 0.05)',
    borderRadius: theme.shape.borderRadius,
    '& .MuiSvgIcon-root': {
        color: theme.palette.success.main,
        marginRight: theme.spacing(1),
    },
}));

const OTP = () => {
    const theme = useTheme();
    const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [resentMessageVisible, setResentMessageVisible] = useState(false);
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || '';
    const typeOtp = location.state?.typeOtp || '';

    const { setIsSignedUp } = useAuth();

    useEffect(() => {
        if (!email) {
            navigate('/error');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 7) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const enteredOtp = otp.join('');
        verifyOtp(enteredOtp);
    };

    const handleResend = (e) => {
        e.preventDefault();
        resendOtp();
    };

    const handleUpdateEmail = () => {
        navigate('/reset-password');
    };

    const resendOtp = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/resend-otp`, {email});
            if (response.data.user) {
                setResentMessageVisible(true);
                setTimeout(() => setResentMessageVisible(false), 3000);
            } else {
                setOtpError('Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            setOtpError('Failed to resend OTP. Please try again.');
        }
    };

    const verifyOtp = async (enteredOtp) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/verify-email`, {
                email,
                otp_code: enteredOtp,
            });

            if (response.data.user) {
                setIsSignedUp(true);
                if (typeOtp === 1) {
                    navigate('/sign-up-success', { state: { email } });
                } else {
                    navigate('/new-password', { state: { email } });
                }
            } else {
                setOtpError('Invalid OTP. Please try again.');
            }
        } catch (error) {
            setOtpError('An error occurred during verification. Please try again.');
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <GradientTypography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}
                >
                    Verify Your Email
                </GradientTypography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        mb: 2,
                        ...getTextColor(theme),
                    }}
                >
                    We sent a verification code to{' '}
                    <Typography
                        component="span"
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                        }}
                    >
                        {email}
                    </Typography>
                </Typography>

                {resentMessageVisible && (
                    <SuccessMessage>
                        <CheckIcon />
                        <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                            Verification code has been resent!
                        </Typography>
                    </SuccessMessage>
                )}

                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500,
                        mb: 2,
                        textAlign: 'center',
                    }}
                >
                    Enter the 8-digit code below
                </Typography>

                <OTPInput>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            maxLength={1}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    ))}
                </OTPInput>

                {otpError && (
                    <Typography
                        color="error"
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            mb: 2,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'rgba(211, 47, 47, 0.1)'
                                : 'rgba(211, 47, 47, 0.05)',
                            padding: theme.spacing(1),
                            borderRadius: theme.shape.borderRadius,
                        }}
                    >
                        {otpError}
                    </Typography>
                )}

                {otp.every(digit => digit !== '') && (
                    <StyledButton
                        variant="contained"
                        fullWidth
                        onClick={handleSubmit}
                        sx={{ mb: 2 }}
                    >
                        Verify Email
                    </StyledButton>
                )}

                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    Didn't receive the code?{' '}
                    <Link
                        href="#"
                        onClick={handleResend}
                        sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        Resend code
                    </Link>
                    {' '}or{' '}
                    <Link
                        href="#"
                        onClick={handleUpdateEmail}
                        sx={{
                            color: theme.palette.primary.main,
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        }}
                    >
                        update email
                    </Link>
                </Typography>
            </AuthCard>
        </AuthContainer>
    );
};

export default OTP;