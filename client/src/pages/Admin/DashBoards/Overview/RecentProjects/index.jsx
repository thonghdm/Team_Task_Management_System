import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Chip,
    Box
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

const RecentProjects = () => {
    const projects = [
        {
            name: 'E-commerce Platform',
            members: '100',
            owner: 'In LO',
            color: '#2196f3'
        },
        {
            name: 'Dashboard UI',
            members: '100',
            owner: 'âdđ minh',
            color: '#4caf50'
        },
        {
            name: 'Dashboard UI',
            members: '100',
            owner: 'Loas',
            color: '#4caf50'
        },
        {
            name: 'Dashboard UI',
            members: '100',
            owner: 'Thông HJO',
            color: '#4caf50'
        },
        {
            name: 'Dashboard UI',
            members: '100',
            owner: 'Thông HJO',
            color: '#4caf50'
        },
    ];

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Recent Big Projects
                </Typography>
                <List>
                    {projects.map((project, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                                <FolderIcon sx={{ color: project.color }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={project.name}
                                secondary={`Members: ${project.members}`}
                            />
                            <ListItemSecondaryAction>
                                <Chip
                                    label={project.owner}
                                    size="small"
                                    sx={{
                                        backgroundColor: project.color,
                                        color: 'white'
                                    }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default RecentProjects;