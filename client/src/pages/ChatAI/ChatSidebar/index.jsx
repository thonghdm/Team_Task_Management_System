import React, { useState } from 'react';
import { 
    List, 
    ListItem, 
    ListItemText, 
    Box,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import { useTheme } from '@mui/material/styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

const chatItems = [
    { id: 1, name: "Hoang Dinh Minh Thong", message: "Last message preview", initials: "HT" },
    { id: 2, name: "Dien", message: "Hello, how are you?", initials: "DL" },
    { id: 3, name: "Lonâg", message: "Meeting at 10AM", initials: "AL" },
    { id: 11, name: "Hoang Dinh Minh Thong", message: "Last message preview", initials: "HT" },
    { id: 21, name: "Dien", message: "Hello, how are you?", initials: "DL" },
    { id: 311, name: "Lonâg", message: "Meeting at 10AM", initials: "AL" },
    { id: 111, name: "Hoang Dinh Minh Thong", message: "Last message preview", initials: "HT" },
    { id: 211, name: "Dien", message: "Hello, how are you?", initials: "DL" },
    { id: 311, name: "Lonâg", message: "Meeting at 10AM", initials: "AL" },
];

const ChatSidebar = () => {
    const location = useLocation();
    const path = location.pathname.split('/')[3] || '';
    const theme = useTheme();
    
    // Add state for menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);

    // Handle menu open
    const handleMenuClick = (event, chatId) => {
        event.preventDefault(); // Prevent navigation
        event.stopPropagation(); // Prevent bubbling
        setAnchorEl(event.currentTarget);
        setSelectedChat(chatId);
    };

    // Handle menu close
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedChat(null);
    };

    // Handle delete chat
    const handleDeleteChat = () => {
        // Add your delete logic here
        console.log(`Deleting chat ${selectedChat}`);
        handleClose();
    };

    return (
        <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }} className="scrollable">
            {chatItems.length > 0 ? (
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {chatItems.map((item) => (
                        <ListItem
                            button
                            component={Link}
                            to={`${item.id}`}
                            key={item.id}
                            sx={{
                                backgroundColor: path === item?._id ? theme.palette.text.disabled : 'inherit',
                                '&:hover': {
                                    backgroundColor: theme.palette.text.disabled,
                                },
                            }}
                        >
                            <ListItemText sx ={{ml:2}}primary={item.name} secondary={item.message} />
                            <IconButton 
                                onClick={(e) => handleMenuClick(e, item.id)}
                                size="small"
                            >
                                <DragIndicatorIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleDeleteChat}>
                            <DeleteIcon sx={{ mr: 1 }} />
                            Delete Chat
                        </MenuItem>
                    </Menu>
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