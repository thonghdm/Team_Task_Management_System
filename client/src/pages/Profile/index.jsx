import React, { useEffect, useState } from 'react';
import { Avatar, Typography, Box, Button, Divider, Grid, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { apiupdateUser } from '~/apis/User/userService';
import { apiRefreshToken } from '~/apis/Auth/authService';
import actionTypes from '~/redux/actions/actionTypes';

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
    const { isLoggedIn, accesstoken, userData } = useSelector(state => state.auth);

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
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra loại file (chỉ chấp nhận ảnh)
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                alert('Chỉ được upload file ảnh (jpeg, png, gif)');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo((prevInfo) => ({
                    ...prevInfo,
                    image: reader.result, // Cập nhật ảnh mới
                }));
            };
            reader.readAsDataURL(file); // Đọc dữ liệu ảnh
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value,
        }));
    };

    const updateUserInfo = async () => {
        const data = new FormData();
        data.append('image', userInfo.image);
        data.append('displayName', userInfo.displayName);
        data.append('jobTitle', userInfo.jobTitle);
        data.append('department', userInfo.department);
        data.append('company', userInfo.company);
        data.append('location', userInfo.location);
        data.append('phoneNumber', userInfo.phoneNumber);
        try {
            const response = await apiupdateUser(accesstoken, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({
                type: actionTypes.USER_UPDATE_SUCCESS,
                data: { userData: response.data.response },
            });
            console.log('Cập nhật thành công:', userInfo);
            console.log('Cập nhật thành công:', response);
        } catch (error) {
            if (error.response?.status === 401) {
                await refreshTokenAndUpdate();
            } else {
                console.error('Cập nhật thất bại:', error.message);
            }
        }
    };

    const refreshTokenAndUpdate = async () => {
        const data = new FormData();
        data.append('image', userInfo.image);
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
            console.log('Cập nhật thành công sau khi refresh token');
        } catch (refreshError) {
            console.error("Lỗi làm mới token:", refreshError);
            if (refreshError.response?.status === 403) {
                alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                dispatch({ type: actionTypes.LOGOUT });
            }
        }
    };

    const handleSaveProfile = async () => {
        await updateUserInfo(); // Gọi hàm updateUserInfo để thực hiện cập nhật thông tin
    };
    const handleBacktoHomePage = () => {
        window.location.href = '/board/home';
    }
    return (
        <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', p: 3 }}>
            <Box
                sx={{
                    bgcolor: '#253858',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 5,
                }}
            >
                <Avatar
                    alt="User Profile"
                    src={userInfo.image || ''} // Hiển thị ảnh đã chọn
                    sx={{
                        width: 120, height: 120, bgcolor: theme.palette.primary.main,
                        objectFit: 'cover',
                    }}
                />
                <Typography variant="h5" sx={{ mt: 2, color: '#fff' }}>
                    {userInfo.displayName}
                </Typography>
                {/* Nút thay đổi avatar */}
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarChange}
                />
                <label htmlFor="avatar-upload">
                    <Button variant="outlined" component="span" sx={{ mt: 2 }}>
                        Thay đổi ảnh đại diện
                    </Button>
                </label>
            </Box>

            <Grid container spacing={0} sx={{ mt: 3 }}>
                <Grid item xs={12} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2, color: 'black' }}>
                            Giới thiệu
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Chức danh của bạn"
                            name="jobTitle"
                            value={userInfo.jobTitle || ''}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'black' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                mb: 2,
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Phòng ban của bạn"
                            name="department"
                            value={userInfo.department || ''}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'black' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                mb: 2,
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Công ty của bạn"
                            name="company"
                            value={userInfo.company || ''}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'black' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                mb: 2,
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Vị trí của bạn"
                            name="location"
                            value={userInfo.location || ''}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'black' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                mb: 2,
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Số điện thoại"
                            name="phoneNumber"
                            value={userInfo.phoneNumber || ''}
                            onChange={handleInputChange}
                            InputProps={{
                                style: {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            InputLabelProps={{
                                style: { color: 'black' },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'black',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'black',
                                    },
                                },
                                mb: 2,
                            }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Tooltip title="This is your email address">
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {userInfo.email}
                            </Typography>
                        </Tooltip>
                        <Button variant="contained" color="primary" onClick={handleSaveProfile} sx={{ mt: 3 }}>
                            Cập nhật thông tin
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleBacktoHomePage} sx={{ mt: 3 }}>
                            Trở về trang chủ
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={2}></Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
