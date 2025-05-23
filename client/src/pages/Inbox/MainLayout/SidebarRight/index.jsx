import React, { useState } from 'react';
import { Box, Typography, Divider, Button, TextField, IconButton } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import { useChat } from '~/Context/ChatProvider';
import { useSelector } from 'react-redux';

const SidebarRight = ({ onClose, setSelectedUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const theme = useTheme();
    const { currentConversation } = useChat();
    const { userData } = useSelector(state => state.auth);

    // Kiểm tra xem đây có phải là cuộc trò chuyện nhóm không
    const isGroup = currentConversation?.isGroup;

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
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
            }}>
                <Typography variant="h6">Conversation Details</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

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
                    mb: 2,
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}
                className="scrollable"
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
                className="scrollable"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    maxHeight: '235px',
                    overflowY: 'auto',
                    flex: 1
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

            <Divider sx={{ mt: 2, mb: 2 }} />

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
    );
};

export default SidebarRight;
