import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    TextField,
    Button,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    IconButton,
    Box,
    styled,
    Select
} from '@mui/material';
import { Group as GroupIcon, Close as CloseIcon, ContentCopy as ContentCopyIcon, LockOutlined as LockOutlinedIcon, ExitToApp as ExitToAppIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

import RoleSelect from '~/Components/ProjectRoleSelect';
import { useTheme } from '@mui/material/styles';
import AlertLeave from '~/pages/Projects/DialogAvt/AlertLeave';
import './styles.css';
import UserSearch from '~/pages/Projects/DialogAvt/UserSearch'

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.text.primary,
    '&:hover': {
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[50]
            : theme.palette.grey[700],
    },
    '&.Mui-selected': {
        backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[600],
        '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
                ? theme.palette.grey[300]
                : theme.palette.grey[500],
        },
    },
}));

const roles = [
    { value: 'admin', label: 'Admin', description: 'Full access to change settings, modify, or delete the project.' },
    { value: 'member', label: 'Member', description: 'Members are part of the team, and can add, edit, and collaborate on all work.' },
    { value: 'viewer', label: 'Viewer', description: "Viewers can search through, view, and comment on your team's work, but not much else." },
];

const StyledButton = styled(Button)(({ theme }) => ({
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    '&:hover': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.common.white,
    },
}));
const DialogAvt = ({ open, onClose, projectName }) => {
    const theme = useTheme();
    const [accessSetting, setAccessSetting] = useState('private');
    const [anchorEl, setAnchorEl] = useState(null);

    const [inviteRole, setInviteRole] = useState('member');
    const [taskCollaborators, setTaskCollaborators] = useState('member');
    const [MyWorkspace, setMyWorkspace] = useState('member');

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const handleCloseAlert = () => {
        console.log("cancel leave project");
        setIsAlertOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLeaveProject = () => {
        console.log("User is leaving the project");
        setIsAlertOpen(true);
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className='scrollable'>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                <Typography variant="h6">{projectName}</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                <Box sx={{ fontSize: '0.75rem' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Invite with email</Typography>
                    
                    <UserSearch/>

                    <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Access settings</Typography>
                    <Select
                        fullWidth
                        value={accessSetting}
                        onChange={(e) => setAccessSetting(e.target.value)}
                    >
                        <StyledMenuItem value="workspace">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <GroupIcon sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="body1">My workspace</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Everyone in your workspace can find and access this project.
                                    </Typography>
                                </Box>
                            </Box>
                        </StyledMenuItem>
                        <StyledMenuItem value="private">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockOutlinedIcon sx={{ mr: 1 }} />
                                <Box>
                                    <Typography variant="body1">Private to members</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Only invited members can find and access this project.
                                    </Typography>
                                </Box>
                            </Box>
                        </StyledMenuItem>
                    </Select>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="subtitle1">Members</Typography>
                    </Box>

                    <List className="scrollable"  sx={{ maxHeight: '270px'}}>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={taskCollaborators}
                                onChange={(e) => setTaskCollaborators(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>TC</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Task collaborators" />
                        </ListItem>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={taskCollaborators}
                                onChange={(e) => setTaskCollaborators(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>TC</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Task collaborators" />
                        </ListItem>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={taskCollaborators}
                                onChange={(e) => setTaskCollaborators(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>TC</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Task collaborators" />
                        </ListItem>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={taskCollaborators}
                                onChange={(e) => setTaskCollaborators(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>TC</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Task collaborators" />
                        </ListItem>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={taskCollaborators}
                                onChange={(e) => setTaskCollaborators(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>TC</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Task collaborators" />
                        </ListItem>
                        <ListItem secondaryAction={
                            <RoleSelect
                                value={MyWorkspace}
                                onChange={(e) => setMyWorkspace(e.target.value)}
                                DB={roles}
                            />
                        }>
                            <ListItemAvatar>
                                <Avatar>MW</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="My workspace"
                                secondary="3 members"
                            />
                        </ListItem>

                        <ListItem
                            secondaryAction={
                                <Box>
                                    <StyledButton
                                        endIcon={<ExpandMoreIcon />}
                                        onClick={handleClick}
                                    >
                                        Project admin
                                    </StyledButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        <StyledMenuItem onClick={handleLeaveProject} sx={{ color: 'error.main' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <ExitToAppIcon sx={{ mr: 1 }} />
                                                <Typography>Leave project</Typography>
                                            </Box>
                                        </StyledMenuItem>
                                    </Menu>
                                </Box>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: 'warning.main' }}>LV</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Luyến Lê Văn"
                                secondary="thongdzpro100@gmail.com"
                            />
                        </ListItem>
                    </List>

                    <AlertLeave
                        open={isAlertOpen}
                        onClose={handleCloseAlert}
                        projectName={projectName}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DialogAvt;