import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Card from '@mui/material/Card';
import { loginWithEmail } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';



export default function SignIn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [password, setPassword] = useState("000000");
    
    const [showPassword, setShowPassword] = useState(false);
    const [email, setGmail] = useState("thongdzpro100@gmail.co3m");

    const { isLoggedIn, typeLogin, error } = useSelector(state => state.auth);
    useEffect(() => {
        console.log(isLoggedIn, typeLogin)
        if (isLoggedIn && typeLogin) {
            navigate('/'); // Redirect to Home page after login
        }
    }, [isLoggedIn, typeLogin, navigate]);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateInputs()) {
            dispatch(loginWithEmail(email, password));
        }
    };

    const handleLogin = (type) => {
        window.open(`http://localhost:5000/api/auth/${type}`, '_self')
        console.log('Login with Google');
    }



    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}
                >
                    Sign in
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
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px', // Adjust the height
                                    padding: '0', // Control the padding
                                },
                            }}
                            color={(emailError || error) ? 'error' : 'primary'}
                            onChange={(e) => setGmail(e.target.value)}
                        />
                    </FormControl>
                    <FormControl>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Link
                                component="button"
                                onClick={() => alert('Forgot password modal placeholder')}
                                variant="body2"
                                sx={{ alignSelf: 'baseline' }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        <TextField
                            error={passwordError || error ? true : false}
                            helperText={passwordErrorMessage}
                            name="password"
                            placeholder="••••••"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={password || error}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px'
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {password !== '' && <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>}
                                    </InputAdornment>
                                ),
                            }}
                            color={passwordError ? 'error' : 'primary'}
                        />
                        {error && <FormLabel sx={{paddingLeft:2, fontSize: 12, color: '#d32f2f' }}>The email address or password you entered isn't connected to an account</FormLabel>}

                    </FormControl>
                    <Button type="submit" fullWidth variant="contained">
                        Sign in
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/sign-up" variant="body2">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }}>or</Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleLogin('google')}
                    >
                        Sign in with Google
                    </Button>
                </Box>
            </Card>

        </Box>

    );
}
