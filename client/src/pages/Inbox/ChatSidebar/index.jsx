import React, { useEffect, useState, useCallback } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, IconButton, Tooltip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '~/pages/Inbox/ChatSidebar/SearchBar';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { getConversation, createConversation, fetchConversationList } from '~/redux/chat/conversation-slice';
import { useChat } from '~/Context/ChatProvider';
import messageApi from '~/apis/chat/messageApi';
import socket from '~/utils/socket';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupsIcon from '@mui/icons-material/Groups';
import CreateGroupModal from '~/components/CreateGroupModal';

export const ChatSidebarContext = React.createContext();

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

const ChatSidebar = ({ setSelectedUserId, children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.split('/')[3] || '';
    const theme = useTheme();
    const { userData, accesstoken } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { setCurrentConversation, currentConversation } = useChat();
    const [conversationsLocal, setConversationsLocal] = useState([]);
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [avatarErrors, setAvatarErrors] = useState({});

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

    // Cập nhật conversationsLocal khi currentConversation thay đổi (ví dụ: khi avatar được cập nhật)
    useEffect(() => {
        if (currentConversation && currentConversation._id) {
            setConversationsLocal(prev => {
                return prev.map(conv => 
                    conv._id === currentConversation._id ? currentConversation : conv
                );
            });
        }
    }, [currentConversation]);

    // Lắng nghe socket để cập nhật chatItem khi có conversation updated
    useEffect(() => {
        const handleConversationUpdated = (updatedConversation) => {
            setConversationsLocal(prev => {
                const exists = prev.some(conv => conv._id.toString() === updatedConversation._id.toString());
                if (exists) {
                    return prev.map(conv =>
                        conv._id.toString() === updatedConversation._id.toString()
                            ? { 
                                ...conv, 
                                lastMessage: updatedConversation.lastMessage,
                                groupInfo: updatedConversation.isGroup ? updatedConversation.groupInfo : conv.groupInfo
                            }
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
            navigate(`${result.payload._id}`);
        } else {
            const createResult = await dispatch(createConversation({ accessToken: accesstoken, userId: userData._id, otherUserId: user._id }));
            if (createResult.type.endsWith('fulfilled') && createResult.payload && createResult.payload._id) {
                setCurrentConversation(createResult.payload);
                if (setSelectedUserId) setSelectedUserId(user._id);
                navigate(`${createResult.payload._id}`);
            }
        }
    };

    // Handle group selection from search
    const handleGroupSelect = (group) => {
        if (group && group.conversation) {
            setCurrentConversation(group.conversation);
            navigate(`${group._id}`);
        }
    };

    // Handle group creation
    const handleGroupCreated = (result) => {
        if (result && result.conversation) {
            // Refresh conversation list
            dispatch(fetchConversationList(accesstoken));
            // Set it as current conversation
            setCurrentConversation(result.conversation);
            navigate(`${result.conversation._id}`);
        }
    };

    // Xử lý lỗi khi avatar không tải được
    const handleAvatarError = (conversationId) => {
        setAvatarErrors(prev => ({
            ...prev,
            [conversationId]: true
        }));
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

    // Tạo chatItems từ conversationsLocal
    const chatItems = (conversationsLocal || []).map(conversation => {
        // For group conversations
        if (conversation.isGroup && conversation.groupInfo) {
            const groupName = conversation.groupInfo.name || 'Group';
            const hasAvatarError = avatarErrors[conversation._id];
            const avatarSrc = hasAvatarError || !conversation.groupInfo.avatar
                ? generateFallbackAvatarUrl(groupName)
                : conversation.groupInfo.avatar;

            return {
                id: conversation._id,
                name: groupName,
                message: conversation.lastMessage ? 
                    `${conversation.lastMessage.sender?.displayName || 'Someone'}: ${conversation.lastMessage.content || ''}` : '',
                initials: groupName.charAt(0).toUpperCase(),
                avatar: avatarSrc,
                avatarColor: generateAvatarColor(groupName),
                isGroup: true,
                conversationObj: conversation,
            };
        }
        
        // For direct conversations
        const other = conversation.participants?.find(u => u._id !== userData?._id);
        const lastMsg = conversation.lastMessage;
        let lastMsgPrefix = '';
        let lastMsgContent = '';
        if (lastMsg) {
            if (lastMsg.sender && lastMsg.sender._id && lastMsg.sender._id.toString() === userData?._id) {
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
            isGroup: false,
            conversationObj: conversation,
        };
    });

    const handleChatItemClick = (item) => {
        setCurrentConversation(item.conversationObj);
        if (!item.isGroup && setSelectedUserId) {
            setSelectedUserId(item.userId);
        }
    };

    return (
        <ChatSidebarContext.Provider value={{ updateLastMessage }}>
            <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }} className="scrollable">
                <Box sx={{ display: 'flex', alignItems: 'center', width: '90%', margin: '10px auto' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <SearchBar 
                            onUserSelect={handleUserSelect} 
                            onGroupSelect={handleGroupSelect}
                        />
                    </Box>
                    <Tooltip title="Create Group">
                        <IconButton 
                            onClick={() => setIsCreateGroupModalOpen(true)}
                            sx={{ ml: 1 }}
                            color="primary"
                        >
                            <GroupAddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                
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
                                    {item.isGroup ? (
                                        <Avatar 
                                            src={item.avatar} 
                                            sx={{ bgcolor: item.avatarColor }}
                                            onError={() => handleAvatarError(item.id)}
                                        >
                                            <GroupsIcon />
                                        </Avatar>
                                    ) : (
                                        <Avatar src={item.avatar}>{item.initials}</Avatar>
                                    )}
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
            
            <CreateGroupModal 
                open={isCreateGroupModalOpen}
                onClose={() => setIsCreateGroupModalOpen(false)}
                onGroupCreated={handleGroupCreated}
            />
        </ChatSidebarContext.Provider>
    );
}

export default ChatSidebar;