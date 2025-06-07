import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, FormLabel, FormControl, InputAdornment, IconButton, Typography, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockResetIcon from '@mui/icons-material/LockReset';
import styled from '@emotion/styled';
import { resetPassword, changePassword } from '~/redux/actions/authAction';
import {
    AuthCard,
    StyledTextField,
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

const PasswordIcon = styled(LockResetIcon)(({ theme }) => ({
    fontSize: '60px',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    animation: 'slideDown 0.5s ease-out',
    '@keyframes slideDown': {
        '0%': {
            transform: 'translateY(-20px)',
            opacity: 0,
        },
        '100%': {
            transform: 'translateY(0)',
            opacity: 1,
        },
    },
}));

const PasswordRequirements = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.shape.borderRadius,
    textAlign: 'left',
    '& ul': {
        margin: 0,
        paddingLeft: theme.spacing(2),
        color: theme.palette.text.secondary,
        fontSize: '0.875rem',
    },
    '& li': {
        marginBottom: theme.spacing(0.5),
    },
}));

export default function NewPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const theme = useTheme();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/error');
        }
    }, [email, navigate]);

    const validatePasswords = () => {
        let isValid = true;

        if (!password.trim() || password.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        if (validatePasswords()) {
            try {
                await dispatch(changePassword(email, password));
                navigate('/sign-up-success', { state: { email } });
            } catch (error) {
                setGeneralError(error.message || 'Failed to reset password. Please try again.');
            }
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

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
                    <PasswordIcon />
                    <GradientTypography
                        component="h1"
                        variant="h4"
                        sx={{ mb: 2 }}
                    >
                        Set New Password
                    </GradientTypography>
                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                            ...getTextColor(theme),
                        }}
                    >
                        Please enter your new password below
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
                            textAlign: 'left',
                        }}
                    >
                        <FormControl>
                            <FormLabel 
                                htmlFor="password"
                                sx={{ textAlign: 'left' }}
                            >
                                New Password
                            </FormLabel>
                            <StyledTextField
                                error={!!passwordError}
                                helperText={passwordError}
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter new password"
                                autoComplete="new-password"
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityIcon sx={{ color: theme.palette.text.primary }} />
                                                ) : (
                                                    <VisibilityOffIcon sx={{ color: theme.palette.text.primary }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel 
                                htmlFor="confirmPassword"
                                sx={{ textAlign: 'left' }}
                            >
                                Confirm Password
                            </FormLabel>
                            <StyledTextField
                                error={!!confirmPasswordError}
                                helperText={confirmPasswordError}
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                required
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={toggleConfirmPasswordVisibility}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityIcon sx={{ color: theme.palette.text.primary }} />
                                                ) : (
                                                    <VisibilityOffIcon sx={{ color: theme.palette.text.primary }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>

                        <PasswordRequirements>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    mb: 1, 
                                    fontWeight: 500,
                                    textAlign: 'left',
                                }}
                            >
                                Password Requirements:
                            </Typography>
                            <ul>
                                <li>At least 6 characters long</li>
                                <li>Include both uppercase and lowercase letters</li>
                                <li>Include at least one number</li>
                                <li>Include at least one special character</li>
                            </ul>
                        </PasswordRequirements>

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
                            sx={{ mt: 1 }}
                        >
                            Reset Password
                        </StyledButton>
                    </Box>
                </Box>
            </AuthCard>
        </AuthContainer>
    );
}