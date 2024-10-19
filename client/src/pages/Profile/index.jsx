import React, { useState } from 'react';
import { Avatar, Typography, Box, Button, Divider, Grid, Input, TextField, IconButton } from '@mui/material';
import { useTheme } from '@mui/system';

const ProfilePage = () => {
    const theme = useTheme();
    const [avatar, setAvatar] = useState(''); // State để lưu đường dẫn ảnh đã tải lên

    // Hàm xử lý khi chọn ảnh mới
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result); // Cập nhật ảnh mới
            };
            reader.readAsDataURL(file); // Đọc dữ liệu ảnh
        }
    };

    return (
        <Box sx={{ bgcolor: '#f4f5f7', minHeight: '100vh', p: 3 }}>
            {/* Header Section */}
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
                    src={avatar || ''} // Hiển thị ảnh đã chọn, nếu chưa chọn thì trống
                    sx={{ width: 120, height: 120, bgcolor: theme.palette.primary.main }}
                />
                <Typography variant="h5" sx={{ mt: 2, color: '#fff' }}>
                    Lê Bá Điền
                </Typography>

                {/* Input để tải ảnh lên */}
                
                

                <Button variant="outlined" sx={{ mt: 1, color: '#fff', borderColor: '#fff' }}>
                    Quản lý tài khoản của bạn
                </Button>
            </Box>

            {/* Profile Information Section */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {/* Left Sidebar */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                            Giới thiệu
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Chức danh của bạn"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Phòng ban của bạn"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Tổ chức của bạn"
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Vị trí của bạn"
                            sx={{ mb: 2 }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">Liên hệ</Typography>
                        <Typography variant="body2" color="textSecondary">
                            lebadien46@gmail.com
                        </Typography>
                    </Box>
                </Grid>

                {/* Right Main Content */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2 }}>
                        <Typography variant="subtitle1">Công việc gần đây</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Những người khác sẽ chỉ xem được những nội dung họ có thể truy cập.
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <JobItem title="(Sample) Create Loan Application Process" project="Microfinance Lending Platform" />
                            <JobItem title="(Sample) Implement User Login" project="Microfinance Lending Platform" />
                            <JobItem title="(Sample) Implement Loan Approval Workflow" project="Microfinance Lending Platform" />
                            <JobItem title="(Sample) User Registration and Authentication" project="Microfinance Lending Platform" />
                        </Box>
                        <Button sx={{ mt: 2 }} color="primary">
                            Xem tất cả
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

const JobItem = ({ title, project }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="body1">{title}</Typography>
        <Typography variant="body2" color="textSecondary">
            {project} - Bạn đã tạo việc này vào hôm nay
        </Typography>
    </Box>
);

export default ProfilePage;
