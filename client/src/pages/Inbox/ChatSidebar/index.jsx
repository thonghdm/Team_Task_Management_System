import React, { useEffect, useState, useCallback } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '~/pages/Inbox/ChatSidebar/SearchBar';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { getConversation, createConversation } from '~/redux/chat/conversation-slice';
import { useChat } from '~/Context/ChatProvider';
import messageApi from '~/apis/chat/messageApi';
import socket from '~/utils/socket';

export const ChatSidebarContext = React.createContext();

const ChatSidebar = ({ setSelectedUserId, children }) => {
    const location = useLocation();
    const path = location.pathname.split('/')[3] || '';
    const theme = useTheme();
    const { userData, accesstoken } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { setCurrentConversation } = useChat();
    const [conversationsLocal, setConversationsLocal] = useState([]);

    // Fetch danh sách cuộc trò chuyện từ API khi vào trang
    useEffect(() => {
        const fetchList = async () => {
            if (accesstoken) {
                try {
                    const data = await messageApi.getConversationList(accesstoken);
                    setConversationsLocal(data);
                } catch (err) {
                    setConversationsLocal([]);
                }
            }
        };
        fetchList();
    }, [accesstoken]);

    // Lắng nghe socket để cập nhật chatItem khi có conversation updated
    useEffect(() => {
        const handleConversationUpdated = (updatedConversation) => {
            setConversationsLocal(prev => {
                const exists = prev.some(conv => conv._id.toString() === updatedConversation._id.toString());
                if (exists) {
                    return prev.map(conv =>
                        conv._id.toString() === updatedConversation._id.toString()
                            ? { ...conv, lastMessage: updatedConversation.lastMessage }
                            : conv
                    );
                } else {
                    // Thêm mới vào đầu danh sách
                    return [updatedConversation, ...prev];
                }
            });
        };
        socket.on('conversation updated', handleConversationUpdated);
        return () => {
            socket.off('conversation updated', handleConversationUpdated);
        };
    }, []);

    // Hàm cập nhật lastMessage cho conversation khi gửi tin nhắn thành công
    const updateLastMessage = useCallback((conversationId, lastMessage) => {
        setConversationsLocal(prev =>
            prev.map(conv =>
                conv._id === conversationId ? { ...conv, lastMessage } : conv
            )
        );
    }, []);

    // Khi chọn user từ search bar
    const handleUserSelect = async (user) => {
        if (!userData?._id || !user?._id) return;
        const result = await dispatch(getConversation({ accessToken: accesstoken, userId: userData._id, otherUserId: user._id }));
        if (result.type.endsWith('fulfilled') && result.payload && result.payload._id) {
            setCurrentConversation(result.payload);
            if (setSelectedUserId) setSelectedUserId(user._id);
        } else {
            const createResult = await dispatch(createConversation({ accessToken: accesstoken, userId: userData._id, otherUserId: user._id }));
            if (createResult.type.endsWith('fulfilled') && createResult.payload && createResult.payload._id) {
                setCurrentConversation(createResult.payload);
                if (setSelectedUserId) setSelectedUserId(user._id);
            }
        }
    };

    // Tạo chatItems từ conversationsLocal
    const chatItems = (conversationsLocal || []).map(conversation => {
        const other = conversation.participants?.find(u => u._id !== userData._id);
        const lastMsg = conversation.lastMessage;
        let lastMsgPrefix = '';
        let lastMsgContent = '';
        if (lastMsg) {
            if (lastMsg.sender && lastMsg.sender._id && lastMsg.sender._id.toString() === userData._id) {
                lastMsgPrefix = 'Tôi: ';
            } else if (lastMsg.sender && lastMsg.sender.displayName) {
                lastMsgPrefix = `${lastMsg.sender.displayName}: `;
            }
            lastMsgContent = lastMsg.content || '';
        }
        return {
            id: conversation._id,
            name: other?.displayName || '',
            message: lastMsg ? (lastMsgPrefix + lastMsgContent) : '',
            initials: (other?.displayName || '').split(' ').map(w => w[0]).join('').toUpperCase(),
            avatar: other?.image || '',
            userId: other?._id || '',
            conversationObj: conversation,
        };
    });

    const handleChatItemClick = (item) => {
        setCurrentConversation(item.conversationObj);
        if (setSelectedUserId) setSelectedUserId(item.userId);
    };

    return (
        <ChatSidebarContext.Provider value={{ updateLastMessage }}>
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
                                onClick={() => handleChatItemClick(item)}
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
                {children}
            </Box>
        </ChatSidebarContext.Provider>
    );
}

export default ChatSidebar;