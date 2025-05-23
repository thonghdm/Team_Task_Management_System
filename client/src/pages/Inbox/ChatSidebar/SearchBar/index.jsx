import React, { useState, useEffect } from 'react';
import { Paper, IconButton, InputBase, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllMembers } from '~/redux/member/member-slice';

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

const SearchBar = ({ onUserSelect, onGroupSelect, placeholder = 'Search users or groups...' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userOptions, setUserOptions] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [avatarErrors, setAvatarErrors] = useState({});
    const theme = useTheme();
    const dispatch = useDispatch();
    const { accesstoken, userData } = useSelector(state => state.auth);
    const memberData = useSelector(state => state.allMember.memberData);
    const conversationState = useSelector(state => state.conversation);
    const conversations = conversationState?.conversations || [];

    // Fetch all members if not loaded
    useEffect(() => {
        if (!memberData && accesstoken) {
            dispatch(fetchAllMembers({ accesstoken }));
        }
    }, [memberData, accesstoken, dispatch]);

    // Filter users and groups locally
    useEffect(() => {
        if (!searchTerm.trim()) {
            setUserOptions([]);
            setGroupOptions([]);
            setShowResults(false);
            return;
        }
        
        setIsSearching(true);
        const search = searchTerm.toLowerCase();
        
        // Filter users
        const filteredUsers = memberData?.users?.filter(user =>
            user._id !== userData?._id &&
            (user.displayName?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.username?.toLowerCase().includes(search))
        ) || [];
        
        // Filter groups from conversations
        const filteredGroups = conversations
            .filter(conv => 
                conv.isGroup && 
                conv.groupInfo && 
                conv.groupInfo.name && 
                conv.groupInfo.name.toLowerCase().includes(search)
            )
            .map(conv => ({
                _id: conv._id,
                name: conv.groupInfo.name,
                avatar: conv.groupInfo.avatar,
                avatarColor: generateAvatarColor(conv.groupInfo.name),
                isGroup: true,
                conversation: conv
            }));
        
        setUserOptions(filteredUsers);
        setGroupOptions(filteredGroups);
        setShowResults(filteredUsers.length > 0 || filteredGroups.length > 0);
        setIsSearching(false);
    }, [searchTerm, memberData, userData, conversations]);

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

    // Xử lý lỗi khi avatar không tải được
    const handleAvatarError = (groupId) => {
        setAvatarErrors(prev => ({
            ...prev,
            [groupId]: true
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserClick = (user) => {
        setSearchTerm('');
        setUserOptions([]);
        setGroupOptions([]);
        setShowResults(false);
        if (onUserSelect) onUserSelect(user);
    };

    const handleGroupClick = (group) => {
        setSearchTerm('');
        setUserOptions([]);
        setGroupOptions([]);
        setShowResults(false);
        if (onGroupSelect) onGroupSelect(group);
    };

    const hasResults = userOptions.length > 0 || groupOptions.length > 0;

    return (
        <Box sx={{ position: 'relative', width: '100%', zIndex: 2 }}>
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
                    onFocus={() => { if (hasResults) setShowResults(true); }}
                />
                <IconButton sx={{ p: '10px', color: '#9e9e9e' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
            </Paper>
            {showResults && hasResults && (
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
                    {groupOptions.length > 0 && (
                        <>
                            <ListItem sx={{ py: 0 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Groups
                                </Typography>
                            </ListItem>
                            {groupOptions.map(group => {
                                const hasAvatarError = avatarErrors[group._id];
                                const avatarSrc = hasAvatarError || !group.avatar
                                    ? generateFallbackAvatarUrl(group.name)
                                    : group.avatar;
                                    
                                return (
                                    <ListItem button key={`group-${group._id}`} onClick={() => handleGroupClick(group)}>
                                        <ListItemAvatar>
                                            <Avatar 
                                                src={avatarSrc} 
                                                sx={{ bgcolor: group.avatarColor }}
                                                onError={() => handleAvatarError(group._id)}
                                            >
                                                <GroupIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle2">{group.name}</Typography>}
                                            secondary={<Typography variant="caption" component="span">Group</Typography>}
                                        />
                                    </ListItem>
                                );
                            })}
                            {userOptions.length > 0 && <Divider sx={{ my: 1 }} />}
                        </>
                    )}
                    
                    {userOptions.length > 0 && (
                        <>
                            <ListItem sx={{ py: 0 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Users
                                </Typography>
                            </ListItem>
                            {userOptions.map(user => (
                                <ListItem button key={`user-${user._id}`} onClick={() => handleUserClick(user)}>
                                    <ListItemAvatar>
                                        <Avatar src={user.image}>{user.displayName?.[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography variant="subtitle2">{user.displayName}</Typography>}
                                        secondary={<Typography variant="caption" component="span">{user.email}</Typography>}
                                    />
                                </ListItem>
                            ))}
                        </>
                    )}
                </List>
            )}
            {showResults && searchTerm.trim() && !hasResults && (
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
                        {isSearching ? 'Đang tìm kiếm...' : 'Không tìm thấy người dùng hoặc nhóm'}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default SearchBar;