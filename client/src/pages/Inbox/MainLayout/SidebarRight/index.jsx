import React, { useState } from 'react';
import { Box, Typography, Divider, Button, TextField, IconButton, Avatar } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import { useChat } from '~/Context/ChatProvider';
import { useSelector } from 'react-redux';
import ChangeGroupAvatarModal from '~/components/ChangeGroupAvatarModal';
import GroupsIcon from '@mui/icons-material/Groups';

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

const SidebarRight = ({ onClose, setSelectedUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isChangeAvatarModalOpen, setIsChangeAvatarModalOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const theme = useTheme();
    const { currentConversation, updateCurrentConversation } = useChat();
    const { userData } = useSelector(state => state.auth);

    // Kiểm tra xem đây có phải là cuộc trò chuyện nhóm không
    const isGroup = currentConversation?.isGroup;
    const groupInfo = currentConversation?.groupInfo;
    const groupName = groupInfo?.name || 'Group';
    const groupAvatar = !avatarError && groupInfo?.avatar ? groupInfo.avatar : generateFallbackAvatarUrl(groupName);
    const avatarColor = generateAvatarColor(groupName);

    const sentFilesAndLinks = [
        { name: 'Image.png', url: 'https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg', isImage: true },
        { name: 'Website link', url: 'https://example.com', isImage: false },
        { name: 'Image.png', url: 'https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg', isImage: true },
        { name: 'Website link', url: 'https://example.com', isImage: false },
        { name: 'Image.png', url: 'https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg', isImage: true },
        { name: 'Website link', url: 'https://example.com', isImage: false },
        { name: 'Image.png', url: 'https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg', isImage: true },
        { name: 'Website link', url: 'https://example.com', isImage: false },
        { name: 'Image.png', url: 'https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg', isImage: true },
        { name: 'Website link', url: 'https://example.com', isImage: false },
    ];

    const handleReport = () => {
        // Handle report action
    };

    const handleBlock = () => {
        // Handle block action
    };

    const handleDelete = () => {
        // Handle delete action
    };

    const handleCopy = () => {
        // Handle copy action
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    const handleOpenChangeAvatarModal = () => {
        setIsChangeAvatarModalOpen(true);
    };

    const handleCloseChangeAvatarModal = () => {
        setIsChangeAvatarModalOpen(false);
    };

    const handleAvatarUpdated = (newAvatarUrl) => {
        // Cập nhật avatar trong currentConversation
        if (currentConversation && updateCurrentConversation) {
            const updatedConversation = {
                ...currentConversation,
                groupInfo: {
                    ...currentConversation.groupInfo,
                    avatar: newAvatarUrl
                }
            };
            updateCurrentConversation(updatedConversation);
            setAvatarError(false); // Reset avatar error state
        }
    };

    return (
        <Box sx={{
            p: 2, 
            borderLeft: '1px solid #ddd',
            backgroundColor: theme.palette.background.default, 
            color: theme.palette.text.primary,
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header - Luôn hiển thị cố định */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2,
                position: 'sticky',
                top: 0,
                backgroundColor: theme.palette.background.default,
                zIndex: 10,
                pt: 1
            }}>
                <Typography variant="h6">Conversation Details</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Phần nội dung có thể cuộn */}
            <Box 
                className="scrollable"
                sx={{ 
                    flex: 1, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    pb: 2
                }}
            >
                {isGroup && (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 2,
                        position: 'relative'
                    }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar 
                                src={groupAvatar}
                                alt={groupName}
                                sx={{ 
                                    width: 80, 
                                    height: 80,
                                    bgcolor: avatarColor,
                                    mb: 1
                                }}
                                onError={handleAvatarError}
                            >
                                <GroupsIcon />
                            </Avatar>
                            <IconButton 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    right: -8, 
                                    backgroundColor: theme.palette.background.paper,
                                    boxShadow: 1,
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.default,
                                    }
                                }}
                                onClick={handleOpenChangeAvatarModal}
                                size="small"
                            >
                                <PhotoCameraIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Typography variant="h6">{groupName}</Typography>
                        {groupInfo?.description && (
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 0.5 }}>
                                {groupInfo.description}
                            </Typography>
                        )}
                    </Box>
                )}

                <Divider sx={{ mb: 2 }} />
                <TextField
                    variant="outlined"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    fullWidth
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: theme.palette.background.paper,
                        },
                    }}
                />
                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Members
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        mb: 2
                    }}
                >
                    {currentConversation?.participants?.map((member) => (
                        <Box
                            key={member._id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                if (member._id !== userData?._id && setSelectedUserId) {
                                    setSelectedUserId(member._id);
                                    onClose();
                                }
                            }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    height: 40,
                                    width: 40,
                                    borderRadius: '50%',
                                    mr: 2,
                                }}
                                alt={member.displayName || 'User'}
                                src={member.image || 'https://via.placeholder.com/40'}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/40';
                                }}
                            />
                            <Typography variant="body1">
                                {member.displayName || member.email || 'User'}
                                {member._id === userData?._id && ' (You)'}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Files and Links
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        mb: 2
                    }}
                >
                    {sentFilesAndLinks.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {item.isImage ? (
                                <Box
                                    component="img"
                                    src={item.url}
                                    alt={item.name}
                                    sx={{ height: 40, width: 40, borderRadius: 1, mr: 1 }}
                                />
                            ) : (
                                <ContentCopyIcon sx={{ mr: 1 }} />
                            )}
                            <Typography variant="body1">
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    {item.name}
                                </a>
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}
                >
                    <Button
                        startIcon={<ReportIcon />}
                        onClick={handleReport}
                        sx={{ mb: 1, color: theme.palette.error.main }}
                    >
                        Report
                    </Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={handleDelete}
                        sx={{ mb: 1, color: theme.palette.error.main }}
                    >
                        Delete chat
                    </Button>
                </Box>
            </Box>

            {/* Modal thay đổi avatar nhóm */}
            <ChangeGroupAvatarModal
                open={isChangeAvatarModalOpen}
                onClose={handleCloseChangeAvatarModal}
                group={currentConversation}
                onAvatarUpdated={handleAvatarUpdated}
            />
        </Box>
    );
};

export default SidebarRight;
