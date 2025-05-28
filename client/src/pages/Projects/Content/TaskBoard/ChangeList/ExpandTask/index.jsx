import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    styled
} from '@mui/material';
import {
    Delete,
    Download,
    Lock
} from '@mui/icons-material';
import { DensityMedium as DensityMediumIcon } from '@mui/icons-material';
import AlertLeave from '~/pages/Projects/DialogAvt/AlertLeave';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { updateTaskThunks } from '~/redux/project/task-slice';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { addNotification } from '~/redux/project/notifications-slice/index';



// Styled components
const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        minWidth: 250,
        marginTop: theme.spacing(1)
    }
}));

const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.background.default,
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.error.main,
        minWidth: 36
    },
    color: theme.palette.error.main
}));
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.grey[800],
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.grey[400],
        minWidth: 36
    }
}));

const ExpandTask = ({ taskId, taskName, projectName }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { members } = useSelector((state) => state.memberProject);
    console.log(members);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };

    ////////////////////////////////////////////////////////////////
    const { accesstoken, userData } = useSelector(state => state.auth)
    const refreshToken = useRefreshToken();
    const dispatch = useDispatch();
    const { projectId } = useParams();

    const confirmDeleteTask = () => {
        try {
            const dataDelete = {
                is_active: false
            };
            const notificationData = members.members
                .filter(member => member.memberId._id !== userData._id && member.is_active === true)
                .map(member => ({
                    senderId: userData._id,
                    receiverId: member.memberId._id,
                    projectId: projectId,
                    type: 'task_update',
                    message: `${userData?.displayName || 'User'} deleted task "${taskName || 'Untitled'}" in project "${projectName || 'Untitled Project'}"`
                }))
            const handleSuccess = () => {
                toast.success('Delete task successfully!');
                handleCloseAlert();
                handleClose();
            };
            const deleteTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataDelete
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return deleteTask(newToken);
                        }
                        throw new Error('Delete task failed');
                        
                    }
                    await dispatch(createAuditLog_project({
                        accesstoken,
                        data: {
                          project_id: projectId,
                          task_id: taskId,
                          action: 'Delete',
                          entity: 'Task',
                          user_id: userData?._id
                        }
                      }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }))
                    await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            // Start the invite process
            deleteTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
            >
                <DensityMediumIcon
                    sx={{
                        width: '13px',
                        height: '13px',
                        cursor: 'pointer',
                    }} />
            </IconButton>

            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {/* <StyledMenuItem>
                    <ListItemIcon>
                        <Lock fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </StyledMenuItem> */}

                <DeleteMenuItem onClick={() => setIsAlertOpen(true)}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete Task</ListItemText>
                </DeleteMenuItem>
            </StyledMenu>

            <AlertLeave
                open={isAlertOpen}
                onClose={handleCloseAlert}
                projectName="Confirm Delete Task"
                lable="Are you sure you want to delete task?"
                onConfirm={confirmDeleteTask}
            />
        </>
    );
};
export default ExpandTask;