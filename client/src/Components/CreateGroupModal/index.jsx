import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Autocomplete, 
    Chip, 
    Box, 
    Typography,
    Avatar,
    CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMembers } from '~/redux/member/member-slice';
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

// Hàm tạo URL avatar dựa trên tên nhóm
const generateAvatarUrl = (name) => {
    if (!name) return '';
    
    // Tạo URL avatar từ tên nhóm (sử dụng API DiceBear hoặc tương tự)
    const initials = name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    // Sử dụng DiceBear API để tạo avatar
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=${encodeURIComponent(generateAvatarColor(name).replace('#', ''))}&chars=${initials}`;
};

const CreateGroupModal = ({ open, onClose, onGroupCreated }) => {
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    
    const { accesstoken, userData } = useSelector(state => state.auth);
    const memberData = useSelector(state => state.allMember.memberData);
    const dispatch = useDispatch();

    // Cập nhật avatar URL khi tên nhóm thay đổi
    useEffect(() => {
        if (groupName) {
            setAvatarUrl(generateAvatarUrl(groupName));
        } else {
            setAvatarUrl('');
        }
    }, [groupName]);

    // Fetch all members if not loaded
    useEffect(() => {
        if (!memberData && accesstoken) {
            dispatch(fetchAllMembers({ accesstoken }));
        }
    }, [memberData, accesstoken, dispatch]);

    // Filter out current user from options
    const memberOptions = memberData?.users?.filter(user => 
        user._id !== userData?._id
    ) || [];

    const handleCreateGroup = async () => {
        // Validate inputs
        if (!groupName.trim()) {
            setError('Group name is required');
            return;
        }

        if (selectedMembers.length === 0) {
            setError('Please select at least one member');
            return;
        }

        setIsCreating(true);
        setError('');

        try {
            // Extract just the IDs from the selected members
            const memberIds = selectedMembers.map(member => member._id);
            
            // Generate avatar URL based on group name
            const finalAvatarUrl = avatarUrl || generateAvatarUrl(groupName);
            
            // Call API to create group with avatar using groupApi
            const result = await groupApi.createGroup(
                accesstoken,
                groupName,
                groupDescription,
                memberIds,
                finalAvatarUrl
            );

            // Reset form and close modal
            setGroupName('');
            setGroupDescription('');
            setSelectedMembers([]);
            setAvatarUrl('');
            
            // Notify parent component about the new group with populated data
            if (onGroupCreated && result.conversation) {
                onGroupCreated(result.conversation);
            }
            
            onClose();
        } catch (err) {
            console.error('Error creating group:', err);
            setError(err.response?.data?.message || 'Failed to create group. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleClose = () => {
        setGroupName('');
        setGroupDescription('');
        setSelectedMembers([]);
        setError('');
        setAvatarUrl('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogContent>
                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                        src={avatarUrl} 
                        alt={groupName || 'Group'} 
                        sx={{ 
                            width: 64, 
                            height: 64, 
                            mr: 2,
                            bgcolor: generateAvatarColor(groupName)
                        }}
                    >
                        {groupName ? groupName[0].toUpperCase() : 'G'}
                    </Avatar>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Group Name"
                        fullWidth
                        variant="outlined"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Box>
                
                <TextField
                    margin="dense"
                    label="Description (Optional)"
                    fullWidth
                    variant="outlined"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    multiline
                    rows={2}
                    sx={{ mb: 2 }}
                />
                
                <Autocomplete
                    multiple
                    id="members-select"
                    options={memberOptions}
                    getOptionLabel={(option) => option.displayName || option.email || ''}
                    value={selectedMembers}
                    onChange={(event, newValue) => {
                        setSelectedMembers(newValue);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Select Members"
                            placeholder="Search users"
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Box display="flex" alignItems="center">
                                <Avatar 
                                    src={option.image} 
                                    alt={option.displayName}
                                    sx={{ width: 24, height: 24, mr: 1 }}
                                >
                                    {option.displayName?.[0]}
                                </Avatar>
                                <Typography>{option.displayName || option.email}</Typography>
                            </Box>
                        </li>
                    )}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                avatar={<Avatar src={option.image}>{option.displayName?.[0]}</Avatar>}
                                label={option.displayName || option.email}
                                {...getTagProps({ index })}
                                key={option._id}
                            />
                        ))
                    }
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={handleCreateGroup} 
                    variant="contained" 
                    color="primary"
                    disabled={isCreating}
                >
                    {isCreating ? <CircularProgress size={24} /> : 'Create Group'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateGroupModal; 