import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  InputAdornment, IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerWithEmail } from '~/redux/actions/authAction';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';




const AddUserButton = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [user, setUser] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({});


  const [open, setOpen] = useState(true);


  const handleOpen = () => setOpen(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

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
  const isValidName = (name) => /^[^\d_!@#$%^&*()=+[\]{};':"|,.<>?~`]{3,255}$/.test(name);

  const validateForm = () => {
    const newErrors = {};
    if (!user.name) newErrors.name = 'Name is required';  // Kiểm tra tên
    else if (!isValidName(user.name)) newErrors.name = 'Name is invalid';

    if (!user.email) newErrors.email = 'Email is required';  // Kiểm tra email
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) newErrors.email = 'Email is invalid';

    if (!user.newPassword) newErrors.newPassword = 'New password is required';

    if (user.newPassword !== user.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isStrongPassword(user.newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters long, contain uppercase and lowercase letters, at least one number, and one special character';
    }

    if (!isStrongPassword(user.confirmPassword)) {
      newErrors.confirmPassword = 'Password must be at least 8 characters long, contain uppercase and lowercase letters, at least one number, and one special character';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    try {
      const res = await dispatch(registerWithEmail(user.name, user.email, user.newPassword));
      if (res.success === true) {
        toast.success('User added successfully');
        setUser({
          name: '',
          email: '',
          newPassword: '',
          confirmPassword: '',
        }); // Reset form
      }
      else {
        setError(res.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    navigate('/admin/users/101');
  };


  return (
    <Card sx={{
      margin: 3,
      mt: "90px"
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader
          title="Add User"
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.5rem',
              fontWeight: 600,
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            mr: 2
          }}
        >
          Add User File
        </Button>
      </Box>
      <CardContent>
        <Box>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user.name}
            error={!!error.name}
            helperText={error.name}
            onChange={handleChange}
            placeholder="Hasde Tung"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            error={!!error.email}
            helperText={error.email}
            onChange={handleChange}
            placeholder="ooooo@gmail.com"
            variant="outlined"
            margin="normal"
            sx={{
              mb: 2
            }}
          />


          <TextField
            fullWidth
            variant="outlined"
            type={showNewPassword ? 'text' : 'password'}
            label="New Password"
            name="newPassword"
            value={user.newPassword}
            error={!!error.newPassword}
            helperText={error.newPassword}
            onChange={handleChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.secondary.contrastText,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-input': {
                color: theme.palette.text.primary,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleNewPasswordVisibility}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Confirm Password Field */}
          <TextField
            fullWidth
            variant="outlined"
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            name="confirmPassword"
            value={user.confirmPassword || ''}
            onChange={handleChange}
            error={!!error.confirmPassword}
            helperText={error.confirmPassword}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.palette.text.primary,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.secondary.contrastText,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.text.primary,
              },
              '& .MuiOutlinedInput-input': {
                color: theme.palette.text.primary,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default AddUserButton;