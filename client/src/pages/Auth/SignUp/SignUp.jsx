//dang nhap
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
import { registerWithEmail } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isLoggedIn, typeLogin, error } = useSelector(state => state.auth);

    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [password1, setPassword] = useState("000000");
    const [showPassword, setShowPassword] = useState(false);

    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [email, setGmail] = useState("thongdzpro100@gmail.co3m");
    const [displayName, setDisplayName] = useState("Thongdz pro100");


    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const name = document.getElementById('name');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        if (!name.value || name.value.length < 1) {
            setNameError(true);
            setNameErrorMessage('Name is required.');
            isValid = false;
        } else {
            setNameError(false);
            setNameErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateInputs()) {
            console.log(displayName, email, password1)
            dispatch(registerWithEmail(displayName, email, password1));
        }
        if (error) {
            navigate('/'); // Redirect to Home page after login
        }
    };

    const handleLogin = (type) => {
        window.open(`http://localhost:5000/api/auth/${type}`, '_self')
    }


    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}
                >
                    Sign up
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
                        <FormLabel htmlFor="name">Full name</FormLabel>
                        <TextField
                            error={nameError}
                            helperText={nameErrorMessage}
                            id="name"
                            type="name"
                            name="name"
                            placeholder="Peter Parker"
                            autoComplete="name"
                            autoFocus
                            required
                            fullWidth
                            value={displayName}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px', // Adjust the height
                                    padding: '0', // Control the padding
                                },
                            }}
                            color={nameError ? 'error' : 'primary'}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </FormControl>
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
                            value={email || error}
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
                            value={password1 || error}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {password1 !== '' && <IconButton
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
                        {error && <FormLabel sx={{mt:1, paddingLeft: 2, fontSize: 12, color: '#d32f2f' }}>Email already in use</FormLabel>}

                    </FormControl>
                    <Button type="submit" fullWidth variant="contained">
                        Sign up
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
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleLogin('google')}
                    >
                        Sign up with Google
                    </Button>
                </Box>
            </Card>
        </Box>
    );
}
