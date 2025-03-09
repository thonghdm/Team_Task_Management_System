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
    Download
} from '@mui/icons-material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import { fetchFileByIdTask, updateAttachmentByIdFileThunk } from '~/redux/project/uploadFile-slice';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'

import { createAuditLog } from '~/redux/project/auditLog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { fetchTaskById } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
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

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.background.default,
    },
    '& .MuiListItemIcon-root': {
        minWidth: 36
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


const FileManagementDialog = ({ fileManagement, taskId, isClickable = true, members, task }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const { projectId } = useParams();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileDownload = async (file) => {
        try {
            handleClose();
            const fileUrl = `src/uploads/projects/${file}`;
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileUrl.split("/").pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Failed to download file");
        }
    };

    /// Delete file
    const refreshToken = useRefreshToken();
    const dispatch = useDispatch();
    const { accesstoken, userData } = useSelector(state => state.auth)

    const handleDelete = (fileId) => {
        try {
            if (!fileManagement) {
                toast.error("File is required");
            }
            if (!isClickable) {
                toast.error("You don't have permission to download file");
                return;
            }
            const fileData = {
                is_active: false
            };
            const notificationData = task?.assigned_to_id
                .filter(member =>
                    member.memberId._id !== userData._id &&
                    members.members.some(m =>
                        m.memberId._id === member.memberId._id &&
                        m.is_active === true
                    )
                )
                .map(member => ({
                    senderId: userData._id,
                    receiverId: member.memberId._id,
                    projectId: projectId,
                    taskId: taskId,
                    type: 'task_update',
                    message: `${userData.displayName} has delete file from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));
            const deleteFileTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateAttachmentByIdFileThunk({ accesstoken: token, attachmentId: fileId, updateData: fileData }));
                    if (updateAttachmentByIdFileThunk.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return deleteFileTask(newToken);
                        }
                        throw new Error('File delete failed');
                    }

                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Delete',
                            entity: 'Attachment',
                            user_id: userData?._id,
                            old_value: fileManagement?.originalName
                        }
                    }));
                    const taskdata = await dispatch(fetchTaskById({ accesstoken: token, taskId }));

                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: taskdata?.payload?.project_id?._id,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id,
                            task_id: taskId,
                        }
                    }))
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    await dispatch(fetchFileByIdTask({ accesstoken: token, taskId }));
                    handleClose();
                    toast.success("File delete successfully");
                } catch (error) {
                    throw error; // Rethrow error nếu không phải error code 2
                }
            };
            deleteFileTask(accesstoken);
        } catch (error) {
            throw error;
        }
    };
    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
            >
                <MoreHorizIcon />
            </IconButton>

            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={() => handleFileDownload(fileManagement?.originalName)}>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Download attachment</ListItemText>
                </StyledMenuItem>
                <DeleteMenuItem onClick={() => handleDelete(fileManagement?._id)}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete attachment</ListItemText>
                </DeleteMenuItem>
            </StyledMenu>
        </>
    );
};
export default FileManagementDialog;