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
    }, [dispatch, accesstoken]);

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

                const filtered = memberData?.data?.users.filter(user =>
                    (
                        user.displayName.toLowerCase().includes(inputValue.toLowerCase()) ||
                        user.email.toLowerCase().includes(inputValue.toLowerCase()) ||
                        user.username.toLowerCase().includes(inputValue.toLowerCase())) &&
                    !value.find(selected => selected._id === user._id)
                );

                setOptions(filtered);
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
const roles = [
    { value: 'Admin', label: 'Admin', description: 'Full access to change settings, modify, or delete the project.' },
    { value: 'Member', label: 'Member', description: 'Members are part of the team, and can add, edit, and collaborate on all work.' },
    { value: 'Viewer', label: 'Viewer', description: "Viewers can search through, view, and comment on your team's work, but not much else." },
];
const UserSearch = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inviteRole, setInviteRole] = useState('Member');
    const { accesstoken } = useSelector(state => state.auth);
    const [error, setError] = useState(null);
    const { projectId } = useParams();
    const dispatch = useDispatch();

    const handleChange = (newValue) => {
        setSelectedUsers(newValue);
        setError(newValue.length === 0 ? 'Please select at least one user' : null);
    };
    const { projectData } = useSelector((state) => state.projectDetail);

    useEffect(() => {
        dispatch(fetchProjectDetail({ accesstoken, projectId }));
        return () => {
            dispatch(resetProjectDetail());
        };
    }, [dispatch, projectId, accesstoken, location.pathname]);

    const handleInvite = async () => {
        if (selectedUsers.length === 0) {
            setError('Please select at least one user');
            return;
        }

        const usersWithRole = selectedUsers.map(user => ({
            isRole: inviteRole,
            memberId: user._id,
            projectId: projectId
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
            setInviteRole('Member');
            setError(null);
        };

        const handleSuccess = () => {
            toast.success('Task created successfully!');
            resetFormState();
        };

        const inviteMember = async (token) => {
            try {
                const req = await dispatch(inviteMemberAsync({ accesstoken: token, inviteData: usersWithRole })).unwrap();
                const update = await dispatch(fetchMemberProject({ accesstoken: token, projectId }))
                handleSuccess();
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshToken();
                    return inviteMember(newToken);
                } else {
                    throw error;
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
            <ToastContainer /> {/* This is where notifications will be displayed */}
        </Box>
    );
};

export default UserSearch;