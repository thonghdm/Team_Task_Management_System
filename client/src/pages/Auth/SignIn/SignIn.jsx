import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { InputAdornment, IconButton, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { loginWithEmail } from '~/redux/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    AuthCard,
    StyledTextField,
    StyledButton,
    OutlinedButton,
    StyledDivider,
    GradientTypography,
    getTextColor,
} from '~/shared/styles/commonStyles';
import styled from '@emotion/styled';

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

export default function SignIn() {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setGmail] = useState("");

    const { isLoggedIn, typeLogin, error } = useSelector(state => state.auth);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const validateInputs = () => {
        const email = document.getElementById('email').value;
        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    const resendOtp = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auth/resend-otp`, { email });
        } catch (error) {
            console.error('OTP resend error:', error);
        }
    };

    const typeOtp = 1;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateInputs()) {
            const result = await dispatch(loginWithEmail(email, password));
            if (result) {
                if (result?.data?.userWithToken?.is_active === false) {
                    navigate('/error');
                } else {
                    if (result?.data?.userWithToken?.isAdmin === true) {
                        navigate('/admin/users/101');
                    } else {
                        if (result?.data?.userWithToken?.is_verified === false) {
                            await resendOtp();
                            navigate('/otp', { state: { email, typeOtp } });
                        } else {
                            navigate('/board/home/1');
                        }
                    }
                }
            }
        }
    };

    const handleLogin = (type) => {
        window.open(`${import.meta.env.VITE_URL_SERVER}/api/auth/${type}`, '_self');
    };

    return (
        <AuthContainer>
            <AuthCard>
                <GradientTypography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}
                >
                    Welcome Back!
                </GradientTypography>
                <Typography
                    variant="body1"
                    sx={{
                        textAlign: 'center',
                        mb: 3,
                        ...getTextColor(theme),
                    }}
                >
                    Sign in to continue your journey with us
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
                            error={emailError || error ? true : false}
                            helperText={emailErrorMessage}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            autoFocus
                            required
                            fullWidth
                            value={email}
                            color={(emailError || error) ? 'error' : 'primary'}
                            onChange={(e) => setGmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Link
                                href="/reset-password"
                                variant="body2"
                                sx={{ alignSelf: 'baseline' }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        <StyledTextField
                            error={passwordError || error ? true : false}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            value={password || error}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {password !== '' && (
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                            </IconButton>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                            color={passwordError ? 'error' : 'primary'}
                        />
                        {error && (
                            <FormLabel sx={{ paddingLeft: 2, fontSize: 12, color: '#d32f2f' }}>
                                The email address or password you entered isn't connected to an account
                            </FormLabel>
                        )}
                    </FormControl>
                    <StyledButton type="submit" fullWidth variant="contained">
                        Sign in
                    </StyledButton>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" variant="body2">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
                <StyledDivider>or</StyledDivider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <OutlinedButton
                        fullWidth
                        variant="outlined"
                        onClick={() => handleLogin('google')}
                        startIcon={
                            <img
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                style={{ width: 20, height: 20 }}
                            />
                        }
                    >
                        Sign in with Google
                    </OutlinedButton>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
}
