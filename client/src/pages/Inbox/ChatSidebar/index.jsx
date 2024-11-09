import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '~/pages/Inbox/ChatSidebar/SearchBar';
import './styles.css';

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
    return (
        <Box sx={{ height: '85vh', display: 'flex', flexDirection: 'column' }} className="scrollable">
            <SearchBar />
            {chatItems.length > 0 ? (
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {chatItems.map((item) => (
                        <ListItem
                            button
                            component={Link}
                            to={`${item.id}`}
                            key={item.id}
                        >
                            <ListItemAvatar>
                                <Avatar>{item.initials}</Avatar>
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