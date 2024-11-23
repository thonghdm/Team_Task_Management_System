import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, TextField, Link, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';
import axios from 'axios';
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
        e.preventDefault(); // Prevent page reload
        resendOtp();
        console.log('Resend OTP');
    };

    const handleUpdateEmail = () => {
        navigate('/sign-up'); // Navigate back to registration page
    };
    const resendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/resend-otp', {email});
            console.log('Resend OTP response:', response.data);
            if (response.data.user) {
                setResentMessageVisible(true);
            } else {
                setOtpError('Failed to resend OTP. Please try again.');
            }
        }
        catch (error) {
            console.error('OTP resend error:', error);
        }
    };
    const verifyOtp = async (enteredOtp) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
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
            console.error('OTP verification error:', error);
        }
    };
    return (
        <Box 
        elevation={3}
        sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.palette.text.primary,
            padding: '20px'
        }}>
            <Box sx={{
                backgroundColor: theme.palette.background.paper,
                padding: '30px',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '400px'
            }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>
                    You're almost done!
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: '10px' }}>
                    We sent a launch code to <span style={{ color:  theme.palette.success.light }}>{email}</span>
                </Typography>
                {resentMessageVisible && (
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <CheckIcon sx={{ color:  theme.palette.success.light, marginRight: '5px' }} />
                        <Typography variant="body2" sx={{ color:  theme.palette.success.light }}>
                            Email was resent!
                        </Typography>
                    </Box>
                )}
                <Typography variant="body2" sx={{ color: '#ff69b4', marginBottom: '10px' }}>
                    → Enter code*
                </Typography>
                <Box sx={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    {otp.map((digit, index) => (
                        <TextField
                            key={index}
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            variant="outlined"
                            inputProps={{
                                maxLength: 1,
                                style: {
                                    textAlign: 'center',
                                    color: theme.palette.text.primary,
                                    fontSize: '24px',
                                    padding: '10px',
                                    width: '20px',
                                    height: '20px'
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor:  theme.palette.secondary.main,
                                    },
                                    '&:hover fieldset': {
                                        borderColor:  theme.palette.primary.main,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.text.primary,
                                    },
                                },
                                backgroundColor: 'transparent'
                            }}
                        />
                    ))}
                </Box>
                {otpError && (
                    <Typography color="error" variant="body2" sx={{ marginBottom: '10px' }}>
                        {otpError}
                    </Typography>
                )}
                {otp.every(digit => digit !== '') && (
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit}>
                        Submit
                    </Button>
                )}
            </Box>
            <Typography variant="body2" sx={{ marginTop: '20px', color: '#6b7280' }}>
                Didn't get your email? <Link href="#" sx={{ color:"primary" }} onClick={handleResend}>Resend the code</Link> or <Link href="#" sx={{ color:"primary" }} onClick={handleUpdateEmail}>update your email address</Link>.
            </Typography>
        </Box>
    );
};

export default OTP;