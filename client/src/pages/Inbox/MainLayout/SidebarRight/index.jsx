import React, { useState } from 'react';
import { Box, Typography, Divider, Button, TextField } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './styles.css';

const SidebarRight = () => {
    const [searchTerm, setSearchTerm] = useState('');

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
        <Box sx={{ p: 2 }}>
            {/* <Typography variant="h6" gutterBottom>
                Details
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                }}
            >
                <Typography variant="body1">Mute messages</Typography>
                <Button size="small" color="primary">
                    Toggle
                </Button>
            </Box> */}

            <Divider sx={{ mb: 2 }} />
            <TextField
                variant="outlined"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Divider sx={{ mb: 2 }} />

            <Typography variant="h6" gutterBottom>
                Members
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
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
                    alt="User avatar"
                    src="https://www.cityguide-dubai.com/fileadmin/_processed_/3/3/csm_img-worlds-of-adventures-teaser_40e4184da1.jpg"
                />
                <Typography variant="body1">camphungg</Typography>
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
                    maxHeight: '235px', // Set maximum height
                    overflowY: 'auto', // Enable vertical scrolling
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
                    sx={{ mb: 1 }}
                >
                    Report
                </Button>
                <Button
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                    sx={{ mb: 1 }}
                >
                    Delete chat
                </Button>
            </Box>
        </Box>
    );
};

export default SidebarRight;
