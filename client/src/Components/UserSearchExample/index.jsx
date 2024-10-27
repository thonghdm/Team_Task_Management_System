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
            <Avatar>{option.name.charAt(0)}</Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={
                <Typography variant="subtitle2">
                    {option.name}
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

    // Mock data - replace with actual API call
    const mockUsers = [
        { id: 12, name: 'Gia Huy Ho', email: 'hogiahu3y21807@gmail.com' },
        { id: 13, name: 'Gia Huy Ho', email: 'hogiah1uy23807@gmail.com' },
        { id: 14, name: 'Gia Huy Ho', email: 'hogiahquy22807@gmail.com' },
        { id: 11, name: 'Gia Huy Ho', email: 'hogiahudy12807@gmail.com' },
        { id: 145, name: 'Gia Huy Ho', email: 'hogiahsuy2r807@gmail.com' },
        { id: 153, name: 'Gia Huy Ho', email: 'hogiahquưy2807@gmail.com' },
        { id: 112, name: 'Gia Huy Ho', email: 'hogiahquyf2807@gmail.com' },
        { id: 1012, name: 'Gia Huy Ho', email: 'hogiaqqhuy2807@gmail.com' },
        { id: 2, name: 'Thong Hoang', email: 'thong@gmail.com' },
        { id: 3, name: 'John Doe', email: 'john@example.com' },
        { id: 4, name: 'Jane Smith', email: 'jane@example.com' },
    ];

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

                const filtered = mockUsers.filter(user =>
                    (user.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                        user.email.toLowerCase().includes(inputValue.toLowerCase())) &&
                    !value.find(selected => selected.id === user.id)
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
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.id} >
                        <CustomOption option={option} />
                    </Box>
                )}
                ListboxProps={{
                    className: 'scrollable'  // This will apply to the options container
                }}
                loading={isSearching}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            key={option.id}
                            label={`${option.name} (${option.email})`}
                            avatar={<Avatar>{option.name.charAt(0)}</Avatar>}
                            {...getTagProps({ index })}
                            sx={{
                                '& .MuiChip-avatar': {
                                    width: 24,
                                    height: 24,
                                    fontSize: '0.875rem'
                                }
                            }}
                        />
                    ))
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

const UserSearchExample = () => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inviteRole, setInviteRole] = useState('member');
    const [error, setError] = useState(null);

    const handleChange = (newValue) => {
        setSelectedUsers(newValue);
        setError(newValue.length === 0 ? 'Please select at least one user' : null);
    };

    const roles = [
        { value: 'admin', label: 'Admin', description: 'Full access to change settings, modify, or delete the project.' },
        { value: 'member', label: 'Member', description: 'Members are part of the team, and can add, edit, and collaborate on all work.' },
        { value: 'viewer', label: 'Viewer', description: "Viewers can search through, view, and comment on your team's work, but not much else." },
    ];

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
            <Button variant="contained" color="primary">
                Invite
            </Button>
        </Box>
    );
};

export default UserSearchExample;