import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Avatar,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import groupApi from '~/apis/chat/groupApi';

// Hàm tạo avatar tự động từ tên nhóm
const generateAvatarColor = (name) => {
    if (!name) return 'hsl(200, 70%, 60%)';
    
    // Tạo màu ngẫu nhiên dựa trên tên nhóm
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
};

// Tạo URL avatar dựa trên tên nhóm (dự phòng)
const generateFallbackAvatarUrl = (name) => {
    if (!name) return '';
    
    const initials = name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${encodeURIComponent(generateAvatarColor(name).replace('#', ''))}&chars=${initials}`;
};

const ChangeGroupAvatarModal = ({ open, onClose, group, onAvatarUpdated }) => {
    const [tempAvatarFile, setTempAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    
    const { accesstoken } = useSelector(state => state.auth);

    useEffect(() => {
        // Cleanup preview URL when component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Reset state when modal opens with new group
    useEffect(() => {
        if (open && group) {
            setPreviewUrl('');
            setTempAvatarFile(null);
            setError('');
        }
    }, [open, group]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (only accept images)
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                setError('Only image files (jpeg, png, gif) are allowed');
                return;
            }

            // Cleanup previous preview URL
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            // Create new preview URL
            const newPreviewUrl = URL.createObjectURL(file);
            setPreviewUrl(newPreviewUrl);
            setTempAvatarFile(file);
            setError('');
        }
    };

    const handleUpdateAvatar = async () => {
        if (!tempAvatarFile) {
            setError('Please select an image first');
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const result = await groupApi.updateGroupAvatar(
                accesstoken,
                group._id,
                tempAvatarFile
            );

            // Show success message
            setSnackbarMessage('Group avatar updated successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            
            // Cleanup
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
            }
            setTempAvatarFile(null);
            
            // Notify parent component
            if (onAvatarUpdated) {
                onAvatarUpdated(result.avatar || result.groupInfo?.avatar);
            }
            
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update group avatar');
            setSnackbarMessage('Failed to update group avatar');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        // Cleanup
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl('');
        }
        setTempAvatarFile(null);
        setError('');
        onClose();
    };

    // Get current avatar or fallback
    const currentAvatar = group?.groupInfo?.avatar || generateFallbackAvatarUrl(group?.groupInfo?.name || 'Group');
    const avatarColor = generateAvatarColor(group?.groupInfo?.name || 'Group');

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Change Group Avatar</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                        <Avatar 
                            src={previewUrl || currentAvatar} 
                            alt={group?.groupInfo?.name || 'Group'} 
                            sx={{ 
                                width: 120, 
                                height: 120, 
                                mb: 2,
                                bgcolor: avatarColor
                            }}
                        >
                            {group?.groupInfo?.name ? group.groupInfo.name[0].toUpperCase() : 'G'}
                        </Avatar>
                        
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="group-avatar-upload"
                            type="file"
                            onChange={handleAvatarChange}
                        />
                        <label htmlFor="group-avatar-upload">
                            <Button
                                variant="outlined"
                                component="span"
                                sx={{ mb: 1 }}
                            >
                                {tempAvatarFile ? 'Choose Another Photo' : 'Select New Avatar'}
                            </Button>
                        </label>
                        
                        {tempAvatarFile && (
                            <Typography variant="caption" color="text.secondary">
                                Click "Update Avatar" to save changes
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateAvatar} 
                        variant="contained" 
                        color="primary" 
                        disabled={!tempAvatarFile || isUploading}
                    >
                        {isUploading ? <CircularProgress size={24} /> : 'Update Avatar'}
                    </Button>
                </DialogActions>
            </Dialog>
            
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChangeGroupAvatarModal; 