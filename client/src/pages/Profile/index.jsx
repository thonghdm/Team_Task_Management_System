import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Box, Button, Divider, Grid, TextField, Tooltip, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { apiupdateUser } from '~/apis/User/userService';
import { apiRefreshToken } from '~/apis/Auth/authService';
import actionTypes from '~/redux/actions/actionTypes';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [userInfo, setUserInfo] = useState({
        email: '',
        image: '',
        displayName: '',
        jobTitle: '',
        department: '',
        company: '',
        location: '',
        phoneNumber: '',
    });
    const [phoneError, setPhoneError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const { isLoggedIn, accesstoken, userData } = useSelector(state => state.auth);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [tempAvatarFile, setTempAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [tempAvatarUrl, setTempAvatarUrl] = useState(''); 
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (isLoggedIn) {
            setUserInfo({
                email: userData.email || '',
                image: userData.image || '',
                displayName: userData.displayName || '',
                jobTitle: userData.jobTitle || '',
                department: userData.department || '',
                company: userData.company || '',
                location: userData.location || '',
                phoneNumber: userData.phoneNumber || '',
            });
        }
    }, [isLoggedIn, userData]);
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phone) {
            setPhoneError('Phone number cannot be left blank');
            return false;
        }
        if (!phoneRegex.test(phone)) {
            setPhoneError('Invalid phone number');
            return false;
        }
        setPhoneError('');
        return true;
    };
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
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            setPhoneError('');
        }
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };
    let imageUrl = userInfo.image;
    const updateUserInfo = async () => {
        setIsUploadingAvatar(true);
        try {
            const data = new FormData();
            // Upload ảnh mới lên Cloudinary nếu có
            if (tempAvatarFile) {
                data.append('image', tempAvatarFile);
            }
            data.append('displayName', userInfo.displayName);
            data.append('jobTitle', userInfo.jobTitle);
            data.append('department', userInfo.department);
            data.append('company', userInfo.company);
            data.append('location', userInfo.location);
            data.append('phoneNumber', userInfo.phoneNumber);
            const response = await apiupdateUser(accesstoken, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({
                type: actionTypes.USER_UPDATE_SUCCESS,
                data: { userData: response.data.response },
            });
            setTempAvatarFile(null);
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
        data.append('displayName', userInfo.displayName);
        data.append('jobTitle', userInfo.jobTitle);
        data.append('department', userInfo.department);
        data.append('company', userInfo.company);
        data.append('location', userInfo.location);
        data.append('phoneNumber', userInfo.phoneNumber);
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

    const handleSaveProfile = async () => {
        if (!isUserInfoChanged()) {
            showNotification('There are no changes to save!', 'info');
            return;
        }
        if (!validatePhoneNumber(userInfo.phoneNumber)) {
            return;
        }
        await updateUserInfo();
    };
    const handleBacktoHomePage = () => {
        if (location.state && location.state.from) {
            navigate(location.state.from);
        } else {
            navigate(-1);
        }
    }
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };
    const showNotification = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };
    const isUserInfoChanged = () => {
        return (
            userInfo.email !== (userData.email || '') ||
            userInfo.displayName !== (userData.displayName || '') ||
            userInfo.jobTitle !== (userData.jobTitle || '') ||
            userInfo.department !== (userData.department || '') ||
            userInfo.company !== (userData.company || '') ||
            userInfo.location !== (userData.location || '') ||
            userInfo.phoneNumber !== (userData.phoneNumber || '') ||
            tempAvatarFile !== null
        );
    };
    return (
        <>
            {/* Full page loading overlay */}
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
                        Đang cập nhật thông tin...
                    </Typography>
                </Box>
            )}
            <Box sx={{
                bgcolor: theme.palette.background.default,
                minHeight: '100vh',
                p: 3
            }}>
                <Box
                    sx={{
                        bgcolor: theme.palette.grey[200],
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 5,
                    }}
                >
                    <Box sx={{ position: 'relative' }}>
                        <Avatar
                            alt="User Profile"
                            src={previewUrl || userInfo.image || ''}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: theme.palette.primary.main,
                                objectFit: 'cover'
                            }}
                        />
                    </Box>
                    <Typography
                        variant="h5"
                        sx={{
                            mt: 2,
                            color: theme.palette.text.primary
                        }}
                    >
                        {userInfo.displayName}
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
                            {tempAvatarFile ? 'Choose another photo' : 'Change your avatar'}
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
                            *Click "Update information" to save the new avatar
                        </Typography>
                    )}
                </Box>

                <Grid container spacing={0} sx={{ mt: 3 }}>
                    <Grid item xs={12} md={2} />
                    <Grid item xs={12} md={8}>
                        <Box sx={{
                            p: 3,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 2,
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 2,
                                    color: theme.palette.text.primary
                                }}
                            >
                                Giới thiệu
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {/* Các TextField được custom theo theme */}
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Job Title"
                                name="jobTitle"
                                value={userInfo.jobTitle || ''}
                                onChange={handleInputChange}
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
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Department"
                                name="department"
                                value={userInfo.department || ''}
                                onChange={handleInputChange}
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
                                    }
                                }}
                            /><TextField
                                fullWidth
                                variant="outlined"
                                label="Company"
                                name="company"
                                value={userInfo.company || ''}
                                onChange={handleInputChange}
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
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Location"
                                name="location"
                                value={userInfo.location || ''}
                                onChange={handleInputChange}
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
                                    }
                                }}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Phone Number"
                                name="phoneNumber"
                                value={userInfo.phoneNumber || ''}
                                onChange={handleInputChange}
                                error={!!phoneError}
                                helperText={phoneError}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: phoneError
                                                ? theme.palette.error.main
                                                : theme.palette.text.primary,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: phoneError
                                                ? theme.palette.error.main
                                                : theme.palette.secondary.contrastText,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: phoneError
                                                ? theme.palette.error.main
                                                : theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: phoneError
                                            ? theme.palette.error.main
                                            : theme.palette.text.primary,
                                    },
                                    '& .MuiOutlinedInput-input': {
                                        color: theme.palette.text.primary,
                                    },
                                    '& .MuiFormHelperText-root': {
                                        color: theme.palette.error.main,
                                        marginLeft: 0,
                                        marginTop: '6px',
                                    }
                                }}
                            />


                            <Divider sx={{ my: 2 }} />
                            <Tooltip title="This is your email address">
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.text.secondary
                                    }}
                                >
                                    {userInfo.email}
                                </Typography>
                            </Tooltip>

                            {/* Buttons với style mới */}
                            <Box sx={{
                                mt: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: 5
                            }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleBacktoHomePage}
                                    sx={{
                                        color: theme.palette.primary.main,
                                        borderColor: theme.palette.primary.main,
                                        '&:hover': {
                                            borderColor: theme.palette.primary.dark,
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveProfile}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        color: '#fff',
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                        }
                                    }}
                                >
                                    Update information
                                </Button>

                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={2} />
                </Grid>
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
            </Box>
        </>
    );

};

export default ProfilePage;
