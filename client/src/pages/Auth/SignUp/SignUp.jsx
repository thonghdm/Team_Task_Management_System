import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { TextField, InputAdornment, IconButton, Alert, AlertTitle } from '@mui/material';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Card from '@mui/material/Card';
import { registerWithEmail } from '~/redux/actions/authAction';
import { useAuth } from '~/pages/Auth/SignUp/AuthContext';

export default function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setIsSignedUp } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const typeOtp = 1;
    const isValidName = (name) => /^[^\d_!@#$%^&*()=+[\]{};':"|,.<>?~`]{3,255}$/.test(name);
    const isStrongPassword = (password) => {
        // Kiểm tra độ dài tối thiểu
        const hasMinimumLength = password.length >= 8;
        // Kiểm tra chữ hoa
        const hasUpperCase = /[A-Z]/.test(password);
        // Kiểm tra chữ thường
        const hasLowerCase = /[a-z]/.test(password);
        // Kiểm tra ký tự số
        const hasNumber = /\d/.test(password);
        // Kiểm tra ký tự đặc biệt
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return hasMinimumLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    }
    const validateInputs = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError('Name is required');
            isValid = false;
        } else if (!isValidName(name)) {
            setNameError('Name must be 3-255 characters long and contain only letters');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!isStrongPassword(password)) {
            setPasswordError('Password must be at least 8 characters long, contain uppercase and lowercase letters, at least one number, and one special character');
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
        setLoading(true);

        if (validateInputs()) {
            try {
                const res=await dispatch(registerWithEmail(name, email, password));
                console.log('registerWithEmail response:', res);
                if(res.success===true){
                    setIsSignedUp(true);
                    navigate('/otp', { state: { email, typeOtp } }); // Pass email to OTP page
                }
                else{
                    setGeneralError(res.message);
                }
            } catch (error) {
                setGeneralError(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleLogin = (type) => {
        window.open(`http://localhost:5000/api/auth/${type}`, '_self');
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <Typography component="h1" variant="h4" sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
                    Sign up
                </Typography>
                {generalError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {generalError}
                    </Alert>
                )}
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
                        <FormLabel htmlFor="name">Full name</FormLabel>
                        <TextField
                            error={!!nameError}
                            helperText={nameError}
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Peter Parker"
                            autoComplete="name"
                            autoFocus
                            required
                            fullWidth
                            value={name}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    padding: '0',
                                },
                            }}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
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
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                        </Box>
                        <TextField
                            error={!!passwordError}
                            helperText={passwordError}
                            name="password"
                            placeholder="••••••"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                        </Box>
                        <TextField
                            error={!!confirmPasswordError}
                            helperText={confirmPasswordError}
                            name="confirmPassword"
                            placeholder="••••••"
                            type={showPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained" disabled={loading}>
                        {loading ? 'Loading...' : 'Sign up'}
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link href="/sign-in" variant="body2">
                            Sign in
                        </Link>
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }}>or</Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button fullWidth variant="outlined" onClick={() => handleLogin('google')} disabled={loading}>
                        Sign up with Google
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}