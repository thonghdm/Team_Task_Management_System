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
    Box,
    useTheme,
    alpha,
    Avatar
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';

const RecentProjects = ({dataBigProjects}) => {
    const theme = useTheme();

    return (
        <Card 
            sx={{ 
                background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
                    : `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.8)} 100%)`,
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark' 
                    ? `0 4px 12px ${alpha(theme.palette.common.black, 0.3)}`
                    : theme.shadows[4],
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    boxShadow: theme.palette.mode === 'dark'
                        ? `0 8px 24px ${alpha(theme.palette.common.black, 0.4)}`
                        : theme.shadows[8],
                },
                height: '100%',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
        >
            <CardContent>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mb: 2,
                        pb: 2,
                        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                    }}
                >
                    <FolderIcon sx={{ 
                        fontSize: 24, 
                        color: theme.palette.primary.main 
                    }} />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 'bold',
                            color: theme.palette.primary.main
                        }}
                    >
                        Recent Big Projects
                    </Typography>
                </Box>

                <List sx={{ p: 0 }}>
                    {dataBigProjects?.map((project, index) => (
                        <ListItem 
                            key={index} 
                            sx={{ 
                                px: 0,
                                py: 1.5,
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? alpha(theme.palette.primary.main, 0.08)
                                        : alpha(theme.palette.primary.main, 0.04),
                                    borderRadius: 1
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 45 }}>
                                <Avatar 
                                    sx={{ 
                                        bgcolor: alpha(project.color, 0.1),
                                        color: project.color,
                                        width: 36,
                                        height: 36
                                    }}
                                >
                                    <FolderIcon />
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 600,
                                            color: theme.palette.text.primary,
                                            mb: 0.5
                                        }}
                                    >
                                        {project.name}
                                    </Typography>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <PeopleIcon sx={{ 
                                            fontSize: 16, 
                                            color: theme.palette.text.secondary 
                                        }} />
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: theme.palette.mode === 'dark'
                                                    ? alpha(theme.palette.text.secondary, 0.8)
                                                    : theme.palette.text.secondary 
                                            }}
                                        >
                                            {project.members} members
                                        </Typography>
                                    </Box>
                                }
                            />
                            <ListItemSecondaryAction>
                                <Chip
                                    label={project.owner}
                                    size="small"
                                    sx={{
                                        background: `linear-gradient(135deg, ${project.color} 0%, ${alpha(project.color, 0.8)} 100%)`,
                                        color: 'white',
                                        fontWeight: 500,
                                        boxShadow: `0 2px 4px ${alpha(project.color, 0.2)}`
                                    }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>

                {(!dataBigProjects || dataBigProjects.length === 0) && (
                    <Box 
                        sx={{ 
                            textAlign: 'center', 
                            py: 4,
                            color: theme.palette.mode === 'dark'
                                ? alpha(theme.palette.text.secondary, 0.7)
                                : theme.palette.text.secondary
                        }}
                    >
                        <FolderIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                        <Typography variant="body1">
                            No recent projects found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentProjects;