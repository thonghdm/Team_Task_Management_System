import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';

// import { sendPasswordResetEmail } from '~/redux/actions/authAction';

export default function ResetPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsSignedUp } = useAuth();

    const typeOtp = 0;
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [generalError, setGeneralError] = useState('');

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

        if (validateEmail()) {
            try {
                // await dispatch(sendPasswordResetEmail(email));
                setIsSignedUp(true);
                console.log('Email:', email,typeOtp);
                navigate('/otp', { state: { email , typeOtp} }); // Navigate to check email page
            } catch (error) {
                setGeneralError(error.message || 'Failed to send reset email. Please try again.');
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <Typography component="h1" variant="h4" sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Reset your password
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
                        <TextField
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
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    padding: '0',
                                },
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    {generalError && (
                        <Typography color="error" variant="body2">
                            {generalError}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained">
                        Send password reset email
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}