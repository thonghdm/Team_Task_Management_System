import React, { useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '~/pages/Inbox/ChatSidebar/SearchBar';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { getConversation, createConversation } from '~/redux/chat/conversation-slice';

const ChatSidebar = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[3] || '';
    const theme = useTheme();
    const { userData, accesstoken } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [localConversation, setLocalConversation] = useState(null);

    // Khi chọn user từ search bar
    const handleUserSelect = async (user) => {
        if (!userData?._id || !user?._id) return;
        // Thử tìm cuộc trò chuyện trước
        const result = await dispatch(getConversation({ accessToken: accesstoken, userId: userData._id, otherUserId: user._id }));
        if (result.type.endsWith('fulfilled') && result.payload && result.payload._id) {
            setLocalConversation(result.payload);
        } else {
            // Nếu không có thì tạo mới
            const createResult = await dispatch(createConversation({ accessToken: accesstoken, userId: userData._id, otherUserId: user._id }));
            if (createResult.type.endsWith('fulfilled') && createResult.payload && createResult.payload._id) {
                setLocalConversation(createResult.payload);
            }
        }
    };

    // Tạo chatItems từ localConversation
    const chatItems = localConversation ? [{
        id: localConversation._id,
        name: localConversation.participants?.find(u => u._id !== userData._id)?.displayName || '',
        message: localConversation.lastMessage?.content || '',
        initials: (localConversation.participants?.find(u => u._id !== userData._id)?.displayName || '').split(' ').map(w => w[0]).join('').toUpperCase(),
        avatar: localConversation.participants?.find(u => u._id !== userData._id)?.image || ''
    }] : [];

    return (
        <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }} className="scrollable">
            <SearchBar onUserSelect={handleUserSelect} />
            {chatItems.length > 0 ? (
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {chatItems.map((item) => (
                        <ListItem
                            button
                            component={Link}
                            to={`${item.id}`}
                            key={item.id}
                            sx={{
                                backgroundColor: path === item.id ? theme.palette.text.disabled : 'inherit',
                                '&:hover': {
                                  backgroundColor: theme.palette.text.disabled,
                                },
                              }}
                        >
                            <ListItemAvatar>
                                <Avatar src={item.avatar}>{item.initials}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={item.name} secondary={item.message} />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <span>No chat items available.</span>
                </Box>
            )}
        </Box>
    );
}

export default ChatSidebar;