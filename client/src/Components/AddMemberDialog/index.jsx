import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Button,
    Autocomplete,
    Box,
    Paper,
    Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import { createAuditLog } from '~/redux/project/auditLog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { fetchTaskById } from '~/redux/project/task-slice';
import { inviteUserTask } from '~/redux/project/task-slice/task-inviteUser-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';

import { addNotification } from '~/redux/project/notifications-slice/index';

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        padding: '2px 8px',
        '& .MuiAutocomplete-input': {
            padding: '7.5px 4px'
        }
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[300]
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.grey[400]
    }
}));



const CustomOption = ({ option, ...props }) => (
    <ListItem {...props} dense>
        <ListItemAvatar>
            <Avatar src={option.image} />
        </ListItemAvatar>
        <ListItemText
            primary={
                <Typography variant="subtitle2">
                    {option.displayName}
                </Typography>
            }
            secondary={
                <Typography variant="caption" component="span">
                    {option.email}
                </Typography>
            }
        />
    </ListItem>
);


const UserSearchInput = ({
    value = [],
    onChange,
    maxSelections = null,
    placeholder = "Search users...",
    error = null
}) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const dispatch = useDispatch();
    const { accesstoken } = useSelector(state => state.auth)
    const { members } = useSelector((state) => state.memberProject);
    const { projectId } = useParams();

    useEffect(() => {
        if (accesstoken) {
            dispatch(fetchMemberProject({ accesstoken, projectId }));
        }
    }, [dispatch, accesstoken, inputValue]);
    useEffect(() => {
        const fetchData = async () => {
            if (!inputValue.trim()) {
                setOptions([]);
                return;
            }

            setIsSearching(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const filtered = members?.members?.filter(member =>
                    member?.is_active === true &&
                    (
                        member?.memberId?.displayName?.toLowerCase().includes(inputValue.toLowerCase()) ||
                        member?.memberId?.email?.toLowerCase().includes(inputValue.toLowerCase()) ||
                        member?.memberId?.username?.toLowerCase().includes(inputValue.toLowerCase())
                    ) &&
                    !value.find(selected => selected?._id === member?.memberId?._id)
                ).map(member => member?.memberId);
                if (filtered) {
                    setOptions(filtered);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setOptions([]);
            } finally {
                setIsSearching(false);
            }
        };

        if (inputValue.trim()) {
            const timeoutId = setTimeout(fetchData, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setOptions([]);
        }
    }, [inputValue, value]);

    const handleChange = (event, newValue) => {
        if (maxSelections && newValue.length > maxSelections) {
            return;
        }
        onChange?.(newValue);
        setInputValue('');
    };

    return (
        <Box>
            <StyledAutocomplete
                multiple
                value={value}
                onChange={handleChange}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                options={options}
                getOptionLabel={(option) => `${option.displayName} (${option.username} - ${option.email})`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderOption={(props, option) => (
                    <Box component="li" {...props} key={option._id} >
                        <CustomOption option={option} />
                    </Box>
                )}
                ListboxProps={{
                    className: 'scrollable'  // This will apply to the options container
                }}
                loading={isSearching}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                            <Chip
                                key={option._id}
                                label={`${option.username}`}
                                avatar={<Avatar src={option.image} />}
                                {...tagProps}
                                sx={{
                                    '& .MuiChip-avatar': {
                                        width: 24,
                                        height: 24,
                                        fontSize: '0.875rem'
                                    }
                                }}
                            />
                        );
                    })
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder={value.length === 0 ? placeholder : ''}
                        error={!!error}
                        helperText={error}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                PaperComponent={({ children, ...props }) => (
                    <Paper {...props} elevation={3}>
                        {inputValue.trim() === '' ? (
                            <Box />
                        ) : options.length === 0 ? (
                            <Box p={2}>
                                <Typography variant="body2" color="textSecondary" align="center">
                                    {isSearching ? 'Searching...' : 'No users found'}
                                </Typography>
                            </Box>
                        ) : (
                            children
                        )}
                    </Paper>
                )}
            />
            {maxSelections && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                    You can select up to {maxSelections} users
                    ({value.length}/{maxSelections})
                </Typography>
            )}
        </Box>
    );
};

const AddMemberDialog = ({ open, onClose, taskId, isClickable = true, taskData }) => {
    const theme = useTheme();
    const { accesstoken, userData } = useSelector(state => state.auth)
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState(null);
    const { projectId } = useParams();
    const dispatch = useDispatch();

    // Reset form when dialog opens with different task or when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedUsers([]);
            setError(null);
        }
    }, [open, taskId]);

    const handleChange = (newValue) => {
        setSelectedUsers(newValue);
        setError(newValue.length === 0 ? 'Please select at least one user' : null);
    };

    function checkMemberIdExists(members, users) {
        for (const member of members) {
            for (const user of users) {
                if (member.memberId === user?.memberId?._id) {
                    return true;
                }
            }
        }
        return false;
    }

    const refreshToken = useRefreshToken();

    const handleSave = async () => {
        try {
            // Validation
            if (selectedUsers.length === 0) {
                setError('Please select at least one user');
                return;
            }

            if (!isClickable) {
                toast.error("You don't have permission to invite user");
                return;
            }
            // Format data
            const userInvite = selectedUsers.map(user => ({
                memberId: user._id,
                task_id: taskId,
                user_invite: userData._id,
                user_name_invite: userData.username,
                user_name: user.username,
                user_email: user.email
            }));
            console.log(userInvite);
            console.log(taskData?.assigned_to_id);
            // Check existing members
            
            if (checkMemberIdExists(userInvite, (taskData?.assigned_to_id)? taskData?.assigned_to_id :  taskData?.members)) {
                toast.error('One or more users already exist');
                setSelectedUsers([]);
                setError(null);
                return;
            }

            // Helper functions
            const resetFormState = () => {
                setSelectedUsers([]);
                setError(null);
            };

            const handleSuccess = () => {
                toast.success('Invite member successfully!');
                resetFormState();
            };

            const inviteMembers = async (token, taskData) => {
                try {
                    const resultAction = await dispatch(inviteUserTask({
                        accesstoken: token,
                        data: userInvite
                    }));

                    if (inviteUserTask.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return inviteMembers(newToken);
                        }
                        throw new Error('Invite members failed');
                    }
                    if (userInvite.length > 0) {
                        await dispatch(createAuditLog({
                            accesstoken: token,
                            data: {
                                task_id: taskId,
                                action: 'Add',
                                entity: 'Member',
                                old_value: userInvite.map(user => user.user_name).join(','),
                                user_id: userData?._id
                            }
                        }));
                        await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                        await dispatch(createAuditLog_project({
                            accesstoken: token,
                            data: {
                                project_id: projectId,
                                action: 'Update',
                                entity: 'Task',
                                user_id: userData?._id,
                                task_id: taskId,
                            }
                        }))
                        await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    }
                    await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));

                    const notificationData = selectedUsers.map(user => ({
                        senderId: userData._id,
                        receiverId: user._id,
                        projectId: projectId,
                        taskId: taskId,
                        type: 'task_invite',
                        message: `You have been invited to the task ${taskData?.task_name} in project ${taskData?.project_id?.projectName}`
                    }))
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                    onClose();
                } catch (error) {
                    throw error;
                }
            };
            // Start the invite process
            inviteMembers(accesstoken, taskData);
            onClose();
        } catch (error) {
            throw error;
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Members</DialogTitle>
            <DialogContent>
                <Box >
                    <UserSearchInput
                        value={selectedUsers}
                        onChange={handleChange}
                        maxSelections={5}
                        error={error}
                        placeholder="Search username, name or email..."
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{ mr: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button sx={{ mr: 2 }} onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMemberDialog;