import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';

import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { apiupdateUser } from '~/apis/User/userService';
import actionTypes from '~/redux/actions/actionTypes';
import { apiRefreshToken } from '~/apis/Auth/authService';
import { changePasswordProfile } from '~/redux/actions/authAction';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ChangePassword = ({ initialUser }) => {
  const { isLoggedIn, accesstoken, userData } = useSelector(state => state.auth);
  const theme = useTheme();

  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState('');
  const [tempAvatarFile, setTempAvatarFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
  };


  const toggleNewPasswordVisibility = () => {
      setShowNewPassword(!showNewPassword);
  };
  const showNotification = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const [user, setUser] = useState(initialUser || {
    password: '',
    newPassword: '',
    confirmPassword: '',
    email: userData.email || '',
    image: userData.image || '',
    displayName: userData.displayName || ''
  });
  useEffect(() => {
    if (isLoggedIn) {
      setUser({
        password: '',
        newPassword: '',
        confirmPassword: '',
        email: userData.email || '',
        image: userData.image || '',
        displayName: userData.displayName || ''
      });
    }
  }, [isLoggedIn, userData]);
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file (chỉ chấp nhận ảnh)
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        alert('Chỉ được upload file ảnh (jpeg, png, gif)');
        return;
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setTempAvatarFile(file);
    }
  };
  const validateForm = () => {
    const newErrors = {};
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
    if (!user.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (user.newPassword === user.password) {
      newErrors.newPassword = 'New password must be different from the current password';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleSubmit = async () => {
    if(previewUrl) {
      await updateUserInfo();
    }
    if (user.password && validateForm()) {
      await updatePassword();
    }
  };
  const updatePassword = async () => {
    const res = await dispatch(changePasswordProfile(user.email, user.password, user.newPassword));
            
            // Reset form
            setUser({
              password: '',
              newPassword: '',
              confirmPassword: '',
              email: userData.email || '',
              image: userData.image || '',
              displayName: userData.displayName || ''
            });
    
            // Reset any previous error states
            setError({});
    
            // Show notification
            if (res.message ==='OK') {
                setOpenSnackbar(true);
                setSnackbarMessage('Password change successfully!');
                setSnackbarSeverity('success');
            } else {
                setOpenSnackbar(true);
                setSnackbarMessage(res.message || 'Wrong password!');
                setSnackbarSeverity('error');
            }
  }
  const updateUserInfo = async () => {
    setIsUploadingAvatar(true);
    try {
      const data = new FormData();
      // Upload ảnh mới lên Cloudinary nếu có
      if (tempAvatarFile) {
        data.append('image', tempAvatarFile);
      }
      const response = await apiupdateUser(accesstoken, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setTempAvatarFile(null);
      dispatch({
        type: actionTypes.USER_UPDATE_SUCCESS,
        data: { userData: response.data.response },
      });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      showNotification('Updated information successfully!', 'success');
    } catch (error) {

      if (error.response?.status === 401) {
        await refreshTokenAndUpdate();
      } else {
        showNotification('Update failed: ' + error.message, 'error');
      }
    }
    finally {
      setIsUploadingAvatar(false);
    }
  };
  const refreshTokenAndUpdate = async () => {
    const data = new FormData();
    if (tempAvatarFile) {
      data.append('image', tempAvatarFile);
    }
    try {
      const response = await apiRefreshToken();
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        data: {
          accesstoken: response.data.token,
          typeLogin: true,
          userData: response.data.userData,
        },
      });
      const res = await apiupdateUser(response.data.token, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch({
        type: actionTypes.USER_UPDATE_SUCCESS,
        data: { userData: res.data.response },
      });
      showNotification('Updated information successfully!');
      console.log('Cập nhật thành công sau khi refresh token');
    } catch (refreshError) {
      console.error("Lỗi làm mới token:", refreshError);
      if (refreshError.response?.status === 403) {
        showNotification('Login session expired, please log in again', 'error');
        dispatch({ type: actionTypes.LOGOUT });
      }
      else {
        showNotification('An error occurred while updating information', 'error');
      }
    }
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

  return (
    <>
      {isUploadingAvatar && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={60} />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          >
            Updating information...
          </Typography>
        </Box>
      )}
      <Card
        sx={{
          margin: 3,
          mt: '90px',
          boxShadow: theme.shadows[4],
          borderRadius: '12px',
        }}
      >
        <CardHeader
          title="Edit User"
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.75rem',
              fontWeight: 700,
              color: theme.palette.primary.main,
            },
            paddingBottom: 0,
            textAlign: 'center',
          }}
        />
        <Divider />
        <Grid container spacing={2} sx={{ padding: 3 }}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt="User Profile"
              src={previewUrl || user.image || ''}
              sx={{
                width: 150,
                height: 150,
                bgcolor: theme.palette.primary.light,
                mt: 2,
                mb: 2,
                fontSize: '2rem',
                fontWeight: 600,
                color: theme.palette.primary.contrastText,
              }}
            >
              DP
            </Avatar>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
              {/* User Name */}
              {user.displayName}
            </Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{
                  mt: 2,
                  color: theme.palette.secondary.main,
                  borderColor: theme.palette.secondary.main,
                  '&:hover': {
                    borderColor: theme.palette.secondary.contrastText,
                  },
                  '&.Mui-disabled': {
                    color: theme.palette.action.disabled,
                    borderColor: theme.palette.action.disabled,
                  }
                }}
              >
                {tempAvatarFile ? 'Choose another photo' : 'Change avatar'}
              </Button>
            </label>
            {tempAvatarFile && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  color: theme.palette.info.main
                }}
              >
                *Click "Update" to save the new avatar
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  variant="outlined"
                  margin="normal"
                  inputProps={{
                    readOnly: true,
                  }}
                  
                />
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  variant="outlined"
                  margin="normal"
                  autoComplete="new-password"
                  error={!!error.password}
                  helperText={error.password}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={togglePasswordVisibility}>
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                />
                <TextField
                  fullWidth
                  label="New Password"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={user.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  variant="outlined"
                  margin="normal"
                  autoComplete="new-password"
                  error={!!error.newPassword}
                  helperText={error.newPassword}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleNewPasswordVisibility}>
                                {showNewPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                />
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter new password"
                  variant="outlined"
                  margin="normal"
                  autoComplete="new-password"
                  error={!!error.confirmPassword}
                  helperText={error.confirmPassword}
                  InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={toggleConfirmPasswordVisibility}>
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
        <Divider />
        <CardActions
          sx={{
            justifyContent: 'flex-end',
            padding: 2
          }}
        >
          <Button
            variant="outlined"
            sx={{
              mr: 1,
              textTransform: 'none',
              borderRadius: '8px',
            }}
          // onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
            }}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </CardActions>
      </Card>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            bgcolor: snackbarSeverity === 'success'
              ? theme.palette.success.main
              : theme.palette.error.main,
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#fff'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;
