import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Chip,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Box,
    Typography,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import RoleSelect from '~/Components/ProjectRoleSelect';
import './styles.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMembers } from '~/redux/member/member-slice';
import { inviteMemberAsync, resetInviteStatus } from '~/redux/project/projectRole-slice';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { addNotification } from '~/redux/project/notifications-slice/index';

import rolesData from '~/apis/roleData';

// Custom styles for Autocomplete

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

// Component for displaying option in dropdown
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

// Main component
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
    const { memberData } = useSelector((state) => state.allMember);

    useEffect(() => {
        if (accesstoken) {
            dispatch(fetchAllMembers({ accesstoken }));
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
                const filtered = memberData?.users?.filter(user => {
                    const searchValue = inputValue.toLowerCase();
                    const isMatch = user?.displayName?.toLowerCase().includes(searchValue) ||
                        user?.email?.toLowerCase().includes(searchValue) ||
                        user?.username?.toLowerCase().includes(searchValue);
                    const isSelected = value.some(selected => selected?._id === user?._id);
                    
                    return isMatch && !isSelected && user.is_active && user.isAdmin === false;
                });
                if (filtered) { setOptions(filtered); }

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
                        ) : options?.length === 0 ? (
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
const roles = [
    ...rolesData,
];
const UserSearch = ({ isClickable = false }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inviteRole, setInviteRole] = useState('Developer');
    const { accesstoken, userData } = useSelector(state => state.auth);
    const [error, setError] = useState(null);
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const handleChange = (newValue) => {
        setSelectedUsers(newValue);
        setError(newValue.length === 0 ? 'Please select at least one user' : null);
    };
    const { projectData } = useSelector((state) => state.projectDetail);

    // useEffect(() => {
    //     dispatch(fetchProjectDetail({ accesstoken, projectId }));
    //     return () => {
    //         dispatch(resetProjectDetail());
    //     };
    // }, [dispatch, projectId, accesstoken]);

    const refreshToken = useRefreshToken();

    const handleInvite = async () => {
        if (selectedUsers.length === 0) {
            setError('Please select at least one user');
            return;
        }
        if (!isClickable) {
            toast.error('You do not have permission to invite members');
            return;
        }
        const usersWithRole = selectedUsers.map(user => ({
            isRole: inviteRole,
            memberId: user._id,
            projectId: projectId,
            user_invite: userData._id,
            user_name_invite: userData.username,
            username: user.username,
            user_email: user.email
        }));

        if (usersWithRole.some(user => projectData?.project?.membersId.includes(user.memberId))) {
            toast.error('One or more users already exist');
            return;
        }
        if (!usersWithRole || usersWithRole.length === 0) {
            toast.error('User is missing!');
            return;
        }

        const resetFormState = () => {
            setSelectedUsers([]);
            setInviteRole('Developer');
            setError(null);
        };

        const notificationData = selectedUsers.map(user => ({
            senderId: userData._id,
            receiverId: user._id,
            projectId: projectId,
            // taskId: taskId,
            type: 'project_invite',
            message: `${userData.displayName} have been invited to the project ${projectData?.project?.projectName}`
        }))

        const handleSuccess = () => {
            toast.success('Member invite successfully!');
            resetFormState();
            
        };

        const inviteMember = async (token) => {
            try {

                await dispatch(inviteMemberAsync({ accesstoken: token, inviteData: usersWithRole })).unwrap();
                await dispatch(createAuditLog_project({
                    accesstoken: token,
                    data: {
                        project_id: projectId,
                        action: 'Add',
                        entity: 'Member',
                        user_id: userData?._id,
                        old_value: usersWithRole.map(user => user.username).join(', ')
                    }
                }));
                await dispatch(fetchMemberProject({ accesstoken: token, projectId }))
                await dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
                await dispatch(addNotification({ accesstoken: token, data: notificationData }))
                handleSuccess();
            } catch (error) {

                if (error.err === 2) {
                    try {
                        const newToken = await refreshToken();
                        if (newToken) {
                            await inviteMember(newToken);
                        }
                    } catch (refreshError) {

                        toast.error(refreshError?.response?.data?.message || 'Error inviting members!');
                    }
                }
                else {
                    toast.error(error?.response?.data?.message || 'One or more users already exist');
                }

            }
        };

        try {
            await inviteMember(accesstoken);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error inviting member!');
        }
    };

    return (
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
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
            <RoleSelect
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                DB={roles}
            />
            <Button variant="contained" color="primary" onClick={handleInvite}>
                Invite
            </Button>
            {/* <ToastContainer /> */}
        </Box>
    );
};

export default UserSearch;