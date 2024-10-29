import React, { useState, useEffect } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import { fetchProjectDetail,resetProjectDetail } from '~/redux/project/projectDetail-slide';

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
    { value: 'Admin', label: 'Admin', description: 'Full access to change settings, modify, or delete the project.' },
    { value: 'Member', label: 'Member', description: 'Members are part of the team, and can add, edit, and collaborate on all work.' },
    { value: 'Viewer', label: 'Viewer', description: "Viewers can search through, view, and comment on your team's work, but not much else." },
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
    const { accesstoken, userData } = useSelector(state => state.auth)

    const [inviteRole, setInviteRole] = useState('Member');
    const [taskCollaborators, setTaskCollaborators] = useState('Member');
    const [myWorkspace, setMyWorkspace] = React.useState('');


    const dispatch = useDispatch();
    const { projectId } = useParams();
    const { members } = useSelector((state) => state.memberProject);
    
    useEffect(() => {
        dispatch(fetchMemberProject({ accesstoken, projectId }));
    }, [dispatch, projectId, accesstoken]);

////////
console.log('members', members)

////////

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

                    <UserSearch />

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

                    <List className="scrollable" sx={{ maxHeight: '270px' }}>
                        {members?.members
                            .filter(member => member.is_active === true)
                            .map((member) => (
                                <ListItem
                                    key={member._id}
                                    secondaryAction={
                                        member?.memberId?._id === userData?._id ? (
                                            <Box>
                                                <StyledMenuItem onClick={handleLeaveProject} sx={{ color: 'error.main' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <ExitToAppIcon sx={{ mr: 1 }} />
                                                        <Typography>Leave</Typography>
                                                    </Box>
                                                </StyledMenuItem>
                                            </Box>
                                        ) : (
                                            <RoleSelect
                                                value={member.isRole}
                                                onChange={(e) => {
                                                    const newRole = e.target.value;
                                                    if (member.isRole === 'Member') {
                                                        setTaskCollaborators(newRole);
                                                    } else if (member.isRole === 'Viewer') {
                                                        setMyWorkspace(newRole);
                                                    }
                                                }}
                                                DB={roles}
                                            />

                                        )
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={member?.memberId?.image}
                                            sx={member.isRole === 'Admin' ? { bgcolor: 'warning.main' } : {}}
                                        >
                                            {member?.memberId?.image}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            member?.memberId?._id === userData?._id
                                                ? `${member?.memberId?.displayName} - ${member.isRole}`
                                                : member?.memberId?.displayName
                                        }
                                        secondary={member?.memberId?.email}
                                    />
                                </ListItem>
                            ))}
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