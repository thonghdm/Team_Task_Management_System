import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import { resetPassword } from '~/redux/actions/authAction';
import { useTheme } from '@mui/material/styles';
import { resetPassword, changePassword } from '~/redux/actions/authAction';


export default function NewPassword() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation(); // Import and use useLocation hook
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <Typography component="h1" variant="h4" sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Set New Password
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
                        <FormLabel htmlFor="password">New Password</FormLabel>
                        <TextField
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
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    padding: '0',
                                },
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end"  sx={{ p: 2 }}>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon sx={{ color: theme.palette.text.primary}} /> : <VisibilityOffIcon sx={{ color: theme.palette.text.primary}} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        <TextField
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
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    padding: '0',
                                },
                            }}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" sx={{ p: 2 }}>
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={toggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityIcon sx={{ color: theme.palette.text.primary}} /> : <VisibilityOffIcon sx={{ color: theme.palette.text.primary}} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    {generalError && (
                        <Typography color="error" variant="body2">
                            {generalError}
                        </Typography>
                    )}
                    <Button type="submit" fullWidth variant="contained">
                        Set New Password
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}