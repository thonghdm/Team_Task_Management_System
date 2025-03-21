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
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchDeleteMember, fetchUpdateMemberRole, fetchLeaveProjectAdmin } from '~/redux/project/projectRole-slice/index';
import { useNavigate } from 'react-router-dom';
import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { addNotification } from '~/redux/project/notifications-slice/index';


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
    { value: 'KickMember', label: 'KickMember', description: "KickMember" },
];
const DialogAvt = ({ open, onClose, projectName }) => {
    const [accessSetting, setAccessSetting] = useState('private');
    const { accesstoken, userData } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const { projectId } = useParams();
    const { members } = useSelector((state) => state.memberProject);
    const [taskCollaborators, setTaskCollaborators] = useState();
    const [roleId, setRoleId] = useState();
    const navigate = useNavigate();
    const { projectData } = useSelector((state) => state.projectDetail);

    useEffect(() => {
        dispatch(fetchMemberProject({ accesstoken, projectId }));
    }, [dispatch, projectId, accesstoken]);


    /////
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };
    const handleLeaveProject = () => {
        setIsAlertOpen(true);
    };
    ////
    const [isAlertOpenRole, setIsAlertOpenRole] = useState(false);
    const handleCloseAlertRole = () => {
        setIsAlertOpenRole(false);
    };
    ////
    const [isAlertOpenDelete, setIsAlertOpenDelete] = useState(false);
    const handleCloseAlertDelete = () => {
        setIsAlertOpenDelete(false);
    };
    ////

    const currentUserRole = members?.members?.find(
        member => member?.memberId?._id === userData?._id
    )?.isRole;
    const isAdmin = currentUserRole === 'Admin';
    const isViewer = currentUserRole === 'Viewer';



    const refreshToken = useRefreshToken();
    const [tempID, setTempID] = useState();
    const handleRoleChange = (newRole, roleId, memberID) => {
        if (newRole === "KickMember") {
            setIsAlertOpenDelete(true);
            setRoleId(memberID);
            setTempID(roleId);
        } else {
            setIsAlertOpenRole(true);
            setTaskCollaborators(newRole);
            setRoleId(roleId);
        }
    };
    const confirmRoleChange = async () => {
        const dataUpdate = {
            isRole: taskCollaborators,
        };
        const notificationData = members.members
            .filter(member => member.memberId._id !== userData._id && member.is_active === true)
            .map(member => ({
                senderId: userData._id,
                receiverId: member.memberId._id,
                projectId: projectId,
                type: 'change_role',
                message: `${userData.displayName} has changed ${members.members.find(m => m._id === roleId)?.memberId?.displayName}'s role to ${taskCollaborators} in project ${projectData?.project?.projectName}`
            }))
        const updateRole = async (token) => {
            try {
                await dispatch(fetchUpdateMemberRole({ accesstoken: token, data: dataUpdate, roleId })).unwrap();
                await dispatch(fetchMemberProject({ accesstoken: token, projectId })); // Ensure token is passed
                await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                toast.success(`Role updated to ${taskCollaborators}`);
                handleCloseAlertRole();
            } catch (error) {
                console.error(error);
                if (error?.err === 2) {
                    const newToken = await refreshToken();
                    return updateRole(newToken); // Retry with new token
                }
                toast.error(error.response?.data.message || 'Error updating role!');
            }
        };
        try {
            await updateRole(accesstoken);
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const confirmDeleteMember = async () => {
        const dataDelete = {
            projectId,
            memberId: roleId
        };
        const notificationData = members.members
            .filter(member => member.memberId._id !== userData._id && member.is_active === true)
            .map(member => ({
                senderId: userData._id,
                receiverId: member.memberId._id,
                projectId: projectId,
                type: 'delete_member',
                message: `${userData.displayName} has removed ${members.members.find(m => m._id === tempID)?.memberId?.displayName} from project ${projectData?.project?.projectName}`
            }))
        const deleteMember = async (token) => {
            try {
                await dispatch(fetchDeleteMember({ accesstoken: token, data: dataDelete })).unwrap();
                await dispatch(fetchMemberProject({ accesstoken: token, projectId })); // Ensure token is passed
                await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                toast.success('Member deleted successfully');
                handleCloseAlertDelete();
            } catch (error) {
                if (error?.err === 2) {
                    const newToken = await refreshToken();
                    return deleteMember(newToken); // Retry with new token
                }
                toast.error(error.response?.data.message || 'Error deleting member!');
            }
        };
        try {
            await deleteMember(accesstoken);
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const confirmLeaveProject = async () => {
        const dataDelete = {
            projectId,
            memberId: userData?._id
        };

        const currentProjectMembers = members?.members?.filter(
            member => member?.projectId === projectId && member?.is_active === true
        );

        if (currentProjectMembers?.length <= 1) {
            toast.error('The project must have more than one member.');
            return;
        }

        const adminMembers = currentProjectMembers?.filter(
            member => member?.isRole === 'Admin'
        );

        if (adminMembers?.length <= 1 && isAdmin) {
            toast.error('The project must have at least one active Admin.');
            return;
        }

        const notificationData = members.members
            .filter(member => member.memberId._id !== userData._id && member.is_active === true)
            .map(member => ({
                senderId: userData._id,
                receiverId: member.memberId._id,
                projectId: projectId,
                type: 'leave_project',
                message: `${userData.displayName} has left project ${projectData?.project?.projectName}`
            }))

        const leaveProjectAdmin = async (token) => {
            try {
                await dispatch(fetchLeaveProjectAdmin({ accesstoken: token, data: dataDelete })).unwrap();
                await dispatch(fetchMemberProject({ accesstoken: token, projectId })); // Ensure token is passed
                await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                await dispatch(fetchProjectsByMemberId({ accesstoken: token, memberId: userData._id }));
                await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                handleLeaveProject();
                navigate('/board/tasks/1/mytask');

            } catch (error) {
                if (error?.err === 2) {
                    const newToken = await refreshToken();
                    return leaveProjectAdmin(newToken); // Retry with new token
                }
                // toast.error(error.response?.data.message || 'Error leave project!');
            }
        };
        try {
            await leaveProjectAdmin(accesstoken);
        } catch (error) {
            console.error("Error leave project:", error);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className='scrollable'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.default', color: 'text.primary' }}>
                    <Typography variant="h6">{projectData?.project?.projectName}</Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
                    <Box sx={{ fontSize: '0.75rem' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Invite with email</Typography>
                        <UserSearch isClickable={isAdmin} />

                        {/* <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Access settings</Typography>
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
                        </Select> */}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="subtitle1">Members</Typography>
                        </Box>

                        <List className="scrollable" sx={{ maxHeight: '270px' }}>
                            {members?.members
                                ?.filter(member => member.is_active === true)
                                ?.map((member) => (
                                    <ListItem
                                        key={member._id}
                                        secondaryAction={
                                            member?.memberId?._id === userData?._id ? (
                                                <Box>
                                                    <StyledMenuItem
                                                        onClick={handleLeaveProject}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <ExitToAppIcon sx={{ mr: 1 }} />
                                                            <Typography>Leave</Typography>
                                                        </Box>
                                                    </StyledMenuItem>
                                                </Box>
                                            ) : (
                                                isAdmin ? (
                                                    <RoleSelect
                                                        value={member.isRole}
                                                        onChange={(e) => {
                                                            const newRole = e.target.value;
                                                            handleRoleChange(newRole, member?._id, member?.memberId?._id);
                                                        }}
                                                        DB={roles}

                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="textSecondary">
                                                        {member.isRole}
                                                    </Typography>
                                                )
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
                            lable="Are you sure you want to leave this project?"
                            onConfirm={confirmLeaveProject}
                        />

                        <AlertLeave
                            open={isAlertOpenDelete}
                            onClose={handleCloseAlertDelete}
                            projectName={projectName}
                            lable={`Are you sure you want to delete member this project?`}
                            onConfirm={confirmDeleteMember}
                        />

                        <AlertLeave
                            open={isAlertOpenRole}
                            onClose={handleCloseAlertRole}
                            projectName={projectName}
                            lable={`Are you sure you want to update the role to ${taskCollaborators}?`}
                            onConfirm={confirmRoleChange} // New prop to confirm the role change
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DialogAvt;