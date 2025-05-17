import React, { useState, useEffect } from 'react';
import { Paper, IconButton, InputBase, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMembers } from '~/redux/member/member-slice';

const SearchBar = ({ onUserSelect, placeholder = 'Search user...' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const theme = useTheme();
    const dispatch = useDispatch();
    const { accesstoken, userData } = useSelector(state => state.auth);
    const memberData = useSelector(state => state.allMember.memberData);

    // Fetch all members if not loaded
    useEffect(() => {
        if (!memberData && accesstoken) {
            dispatch(fetchAllMembers({ accesstoken }));
        }
    }, [memberData, accesstoken, dispatch]);

    // Filter users locally
    useEffect(() => {
        if (!searchTerm.trim() || !memberData?.users) {
            setOptions([]);
            setShowResults(false);
            return;
        }
        setIsSearching(true);
        const search = searchTerm.toLowerCase();
        const filtered = memberData.users.filter(user =>
            user._id !== userData?._id &&
            (user.displayName?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.username?.toLowerCase().includes(search))
        );
        setOptions(filtered);
        setShowResults(true);
        setIsSearching(false);
    }, [searchTerm, memberData, userData]);

    // Hide dropdown when click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !event.target.closest('.searchbar-dropdown') &&
                !event.target.closest('.searchbar-input')
            ) {
                setShowResults(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserClick = (user) => {
        setSearchTerm('');
        setOptions([]);
        setShowResults(false);
        if (onUserSelect) onUserSelect(user);
    };

    return (
        <Box sx={{ position: 'relative', width: '90%', margin: '10px auto', zIndex: 2 }}>
            <Paper
                component="form"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: theme.palette.background.paper,
                    width: '100%',
                    borderRadius: '24px',
                    transition: 'width 0.3s',
                }}
                onSubmit={e => e.preventDefault()}
            >
                <InputBase
                    className="searchbar-input"
                    sx={{ pl: '10px', ml: 1, flex: 1, color: 'inherit' }}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                    inputProps={{ 'aria-label': 'search' }}
                    onFocus={() => { if (options.length > 0) setShowResults(true); }}
                />
                <IconButton sx={{ p: '10px', color: '#9e9e9e' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            {showResults && options.length > 0 && (
                <List
                    className="searchbar-dropdown"
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        maxHeight: 300,
                        overflowY: 'auto',
                        borderRadius: '0 0 16px 16px',
                        zIndex: 10,
                    }}
                >
                    {options.map(user => (
                        <ListItem button key={user._id} onClick={() => handleUserClick(user)}>
                            <ListItemAvatar>
                                <Avatar src={user.image}>{user.displayName?.[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="subtitle2">{user.displayName}</Typography>}
                                secondary={<Typography variant="caption" component="span">{user.email}</Typography>}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
            {showResults && searchTerm.trim() && options.length === 0 && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        zIndex: 10,
                        p: 2,
                        borderRadius: '0 0 16px 16px',
                    }}
                >
                    <Typography variant="body2" color="textSecondary" align="center">
                        {isSearching ? 'Đang tìm kiếm...' : 'Không tìm thấy người dùng'}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;