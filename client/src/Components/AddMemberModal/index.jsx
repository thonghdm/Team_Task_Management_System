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
    CircularProgress,
    Alert
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMembers } from '~/redux/member/member-slice';
import groupApi from '~/apis/chat/groupApi';
import { useChat } from '~/Context/ChatProvider';

const AddMemberModal = ({ open, onClose, onMemberAdded }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const { accesstoken, userData } = useSelector(state => state.auth);
    const memberData = useSelector(state => state.allMember.memberData);
    const { currentConversation } = useChat();

    // Fetch all members if not loaded
    useEffect(() => {
        if (!memberData && accesstoken) {
            dispatch(fetchAllMembers({ accesstoken }));
        }
    }, [memberData, accesstoken, dispatch]);

    // Filter out users who are already members of the group
    useEffect(() => {
        if (memberData?.users && currentConversation?.participants) {
            const currentMemberIds = currentConversation.participants.map(p => p._id);
            const availableMembers = memberData.users.filter(user => 
                !currentMemberIds.includes(user._id)
            ).map(user => ({
                ...user,
                // Thêm thông tin để sort và highlight
                searchScore: 0
            }));
            setMemberOptions(availableMembers);
        }
    }, [memberData, currentConversation]);

    const handleClose = () => {
        setSelectedMembers([]);
        setError('');
        onClose();
    };

    const handleAddMembers = async () => {
        if (selectedMembers.length === 0) {
            setError('Please select at least one member to add');
            return;
        }

        setIsAdding(true);
        setError('');

        try {
            // Add members to group one by one
            await Promise.allSettled(selectedMembers.map(member =>
                groupApi.addMemberToGroup(accesstoken, currentConversation._id, member._id)
            ));

            // Success - call callback if provided
            if (onMemberAdded) {
                onMemberAdded(selectedMembers);
            }

            handleClose();
        } catch (error) {
            console.error('Error adding members:', error);
            setError(error.message || 'Failed to add members. Please try again.');
        } finally {
            setIsAdding(false);
        }
    };

    if (!currentConversation?.isGroup) {
        return null;
    }

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Members to {currentConversation?.groupInfo?.name || 'Group'}</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select members to add to this group chat
                </Typography>
                
                <Autocomplete
                    multiple
                    id="add-members-select"
                    options={memberOptions}
                    getOptionLabel={(option) => option.displayName || option.email || ''}
                    value={selectedMembers}
                    onChange={(event, newValue) => {
                        setSelectedMembers(newValue);
                        setError(''); // Clear error when selection changes
                    }}
                    filterOptions={(options, { inputValue }) => {
                        if (!inputValue) return options;
                    
                        const searchTerm = inputValue.toLowerCase();
                    
                        return options
                            .map(option => {
                                let score = 0;
                    
                                if (option.email?.toLowerCase().includes(searchTerm)) score += 100;
                                if (option.displayName?.toLowerCase().includes(searchTerm)) score += 50;
                                if (option.username?.toLowerCase().includes(searchTerm)) score += 25;
                    
                                return { option, score };
                            })
                            .filter(entry => entry.score > 0)
                            .sort((a, b) => b.score - a.score)
                            .map(entry => entry.option); 
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Search by name or email"
                            placeholder="Type name or email to search users"
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Box display="flex" alignItems="center">
                                <Avatar 
                                    src={option.image} 
                                    alt={option.displayName}
                                    sx={{ width: 32, height: 32, mr: 2 }}
                                >
                                    {option.displayName?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography 
                                        variant="body1"
                                        sx={{ 
                                            fontWeight: option.isNameMatch ? 'bold' : 'normal',
                                            color: option.isNameMatch ? 'primary.main' : 'inherit'
                                        }}
                                    >
                                        {option.displayName || option.email}
                                    </Typography>
                                    {option.displayName && option.email && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: option.isEmailMatch ? 'primary.main' : 'text.secondary',
                                                fontWeight: option.isEmailMatch ? 'bold' : 'normal'
                                            }}
                                        >
                                            {option.email}
                                            {option.isEmailMatch && ' ✓'}
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </li>
                    )}
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                avatar={<Avatar src={option.image} sx={{ width: 24, height: 24 }}>{option.displayName?.[0]?.toUpperCase()}</Avatar>}
                                label={option.displayName || option.email}
                                {...getTagProps({ index })}
                                key={option._id}
                            />
                        ))
                    }
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    noOptionsText="No available users to add"
                />
                
                {memberOptions.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                        All users are already members of this group.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isAdding}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleAddMembers} 
                    variant="contained" 
                    color="primary"
                    disabled={isAdding || selectedMembers.length === 0}
                >
                    {isAdding ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Adding...
                        </>
                    ) : (
                        `Add ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMemberModal;