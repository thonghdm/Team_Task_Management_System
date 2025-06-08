import React, { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, Button, Avatar, Chip,
    Dialog, DialogTitle, DialogContent, IconButton, DialogActions, DialogContentText
} from '@mui/material';
import {
    Close, CalendarToday, Add, MoreHoriz, InsertDriveFile, DensityMedium
} from '@mui/icons-material';
import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import CommentList from './CommentList';
import ActivityLog from './ActivityLog';
import DueDatePicker from '~/Components/DueDatePicker';
import { useTheme } from '@mui/material/styles';
import ColorPickerDialog from '~/Components/ColorPickerDialog';
import FileUploadDialog from '~/Components/FileUploadDialog';
// import FileManagementDialogs from '~/Components/FileManagementDialogs';
import AddMemberDialog from '~/Components/AddMemberDialog';
import { fetchTaskById } from '~/redux/project/task-slice';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import PrioritySelector from './PrioritySelector';
import StatusSelector from './StatusSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs';
import { fetchFileByIdTask } from '~/redux/project/uploadFile-slice';
import { formatFileSize } from '~/utils/formatFileSize';

import FileManagementDialog from '~/Components/FileManagementDialog';
import AlertLeave from '~/pages/Projects/DialogAvt/AlertLeave';
import { updateMemberTaskThunks } from '~/redux/project/task-slice/task-inviteUser-slice';
import { updateLabelThunks } from '~/redux/project/label-slice';

import EditableText from '~/Components/EditableText';
import { updateTaskThunks } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';

import { createAuditLog } from '~/redux/project/auditlog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
// import AnimationDone from '~/Components/AnimationDone';
import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'
import { addNotification } from '~/redux/project/notifications-slice/index';

import TaskReview from '../TaskReview';
import socket from '~/utils/socket';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    maxHeight: '90vh',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: alpha(theme.palette.primary.main, 0.05),
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: alpha(theme.palette.primary.main, 0.2),
      borderRadius: '4px',
      '&:hover': {
        background: alpha(theme.palette.primary.main, 0.3),
      },
    },
  },
  '& .MuiDialogTitle-root': {
    padding: theme.spacing(2.5, 3),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    background: `linear-gradient(to right, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
    backdropFilter: 'blur(8px)',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
    background: `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.95)})`,
  }
}));


const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '12px',
  padding: theme.spacing(0.75, 2),
  fontWeight: 500,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  letterSpacing: '0.5px',
  position: 'relative',
  paddingBottom: theme.spacing(1),
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '2px',
    background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`,
    borderRadius: '2px',
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.7)}, ${alpha(theme.palette.background.paper, 0.9)})`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.04)}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: alpha(theme.palette.primary.main, 0.3),
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.08)}`,
  },
}));

const ChangeList = ({ open, onClose, taskId }) => {
    const theme = useTheme();
    const [cmt, setCMT] = useState("Write a comment");
    const dispatch = useDispatch();
    const defaultAvatar = '/225-default-avatar.png';
    // Show details
    const [showDetails, setShowDetails] = useState(false);
    const toggleDetails = () => {
        setShowDetails((prev) => !prev);
    };
    //

    // Color picker
    const [openColorPicker, setOpenColorPicker] = useState(false);
    // const [label, setLabel] = useState({ title: '', color: '' });
    const handleOpenColorPicker = () => setOpenColorPicker(true);
    const handleCloseColorPicker = (color, title) => {
        setOpenColorPicker(false);
        if (color && title) setLabel({ title, color });
    };
    //

    // Add File
    const [openFile, setOpenFile] = useState(false);
    const handleOpenFile = () => setOpenFile(true);
    const handleCloseFile = () => setOpenFile(false);

    // add member
    const [openAvt, setOpenAvt] = useState(false);
    const handleOpenAvt = () => setOpenAvt(true);
    const handleCloseAvt = () => setOpenAvt(false);

    ///delete assignee
    const [openMember, setOpenMember] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [idMember, setIdMemberMember] = useState(null);
    const [selectedMemberName, setSelectedMemberName] = useState(null);
    const handleDeleteMemberClick = (memberId, memberName, userIdx) => {
        setSelectedMember(memberId);
        setSelectedMemberName(memberName);
        setIdMemberMember(userIdx);
        setOpenMember(true);
    };
    const handleApproval = (taskId, status) => {
        console.log(taskId, status);
    }
    /// delete label
    const [openLabel, setOpenLabel] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const [selectedLabelName, setSelectedLabelName] = useState(null);

    const handleDeleteLabelClick = (labelId, labelName) => {
        setSelectedLabel(labelId);
        setSelectedLabelName(labelName);
        setOpenLabel(true);
    }

    //Accept task
    const handleConfirmReviewTask = async (task_accept_status) => {
        console.log('accept task?', task_accept_status, taskId);
        try {
            let dataSave = {
                task_review_status: task_accept_status
            };
            let message = '';
            if (task_accept_status === 'accept') {
                message = `${userData.displayName} has accepted task ${task?.task_name} in project ${task?.project_id?.projectName}`
            } else {
                message = `${userData.displayName} has rejected task ${task?.task_name} in project ${task?.project_id?.projectName}`
                dataSave = { ...dataSave,  status: 'In Progress', done_date: '1000-10-10T00:00:00.000+00:00'};
            }
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
                    message: message
                }));

            const handleSuccess = () => {
                // Emit task review event
                socket.emit('task_review', { taskId, projectId });
                socket.emit('task_updated', { taskId, projectId });
            };
            const saveTaskReview = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return saveTaskReview(newToken);
                        }
                        throw new Error('Delete status task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task Review',
                            old_value: task?.task_review_status,
                            new_value: task_accept_status,
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            await saveTaskReview(accesstoken);
        }
        catch (error) {
            throw error;
        }
    }
    //
    const { accesstoken, userData } = useSelector(state => state.auth)
    const { task } = useSelector(state => state.task);
    const refreshToken = useRefreshToken();
    const { projectId } = useParams();

    useEffect(() => {
        const getTaskDetail = async (token) => {
            try {
                const resultAction = await dispatch(fetchTaskById({ accesstoken: token, taskId }))
                console.log('resultAction', resultAction);
                if (fetchTaskById.rejected.match(resultAction)) {
                    if (resultAction.payload?.err === 2) {
                        const newToken = await refreshToken();
                        return getTaskDetail(newToken);
                    }
                    throw new Error('Comment creation failed');
                }
            } catch (error) {
                throw error; // Rethrow error nếu không phải error code 2
            }
        };
        getTaskDetail(accesstoken);

    }, [dispatch, taskId, accesstoken]);

    //check view
    const { members } = useSelector((state) => state.memberProject);
    const currentUserRole = members?.members?.find(
        member => member?.memberId?._id === userData?._id
    )?.isRole;
    const isViewer = currentUserRole === 'Viewer';

    /// get file
    const { files } = useSelector(state => state.uploadFile);
    useEffect(() => {
        const getFileDetail = async (token) => {
            try {
                const resultAction = await dispatch(fetchFileByIdTask({ accesstoken: token, taskId }))
                if (fetchFileByIdTask.rejected.match(resultAction)) {
                    if (resultAction.payload?.err === 2) {
                        const newToken = await refreshToken();
                        return getFileDetail(newToken);
                    }
                    throw new Error('get file failed');
                }
            } catch (error) {
                throw error;
            }
        };

        getFileDetail(accesstoken);
    }, [dispatch, taskId, accesstoken]);

    const handleConfirmDeleteMember = () => {
        try {
            const dataDelete = {
                _id: selectedMember,
                name: selectedMemberName,
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
                    type: 'delete_member',
                    message: `${userData.displayName} has removed ${task?.assigned_to_id.find(m => m.memberId._id === idMember)?.memberId?.displayName} from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));
            if (isViewer) {
                toast.error('You do not have permission to perform this action!');
                return;
            }
            const handleSuccess = () => {
                toast.success('Delete member successfully!');
                setOpenMember(false);
                setSelectedMember(null);
                setSelectedLabelName(null);
                socket.emit('task_updated', { taskId, projectId });
            };
            const deleteMembers = async (token) => {
                try {
                    const resultAction = await dispatch(updateMemberTaskThunks({
                        accesstoken: token,
                        data: dataDelete
                    }));
                    if (updateMemberTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return deleteMembers(newToken);
                        }
                        throw new Error('Delete members failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Delete',
                            entity: 'Member',
                            old_value: dataDelete?.name,
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            // Start the invite process
            deleteMembers(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    const handleCancelDeleteMember = () => {
        setOpenMember(false);
        setSelectedMember(null);
        setSelectedMemberName(null);
    };

    // delete label
    const handleConfirmDeleteLabel = () => {
        try {
            const dataDelete = {
                _id: selectedLabel,
                is_active: false,
                old_value: selectedLabelName
            };
            if (isViewer) {
                toast.error('You do not have permission to perform this action!');
                return;
            }
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
                    message: `${userData.displayName} has removed label "${selectedLabelName}" from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));
            const handleSuccess = () => {
                toast.success('Delete label successfully!');
                setOpenLabel(false);
                setSelectedLabel(null);
                setSelectedLabelName(null);
                socket.emit('task_updated', { taskId, projectId });
            };
            const deleteLabel = async (token) => {
                try {
                    const resultAction = await dispatch(updateLabelThunks({
                        accesstoken: token,
                        data: dataDelete
                    }));
                    if (updateLabelThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return deleteLabel(newToken);
                        }
                        throw new Error('Delete label failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Delete',
                            entity: 'Label',
                            old_value: dataDelete?.old_value,
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            deleteLabel(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    const handleCancelDeleteLabel = () => {
        setOpenLabel(false);
        setSelectedLabel(null);
        setSelectedLabelName(null);
    };

    /// save task name
    const handleSaveTitle = (newText) => {
        try {
            const dataSave = {
                task_name: newText
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
                    message: `${userData.displayName} has save title "${newText}" from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));

            const handleSuccess = () => {
                // toast.success('Update title task successfully!');
                socket.emit('task_updated', { taskId, projectId });
            };
            const saveTitleTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return saveTitleTask(newToken);
                        }
                        throw new Error('Update title task failed');
                    }
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            saveTitleTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// save Priority
    const handleSavePriority = (newPriority) => {
        try {
            const dataSave = {
                priority: newPriority
            };
            if (isViewer) {
                toast.error('You do not have permission to perform this action!');
                return;
            }
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
                    message: `${userData.displayName} has save priority "${newPriority}" from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));

            const handleSuccess = () => {
                // toast.success('Update priority task successfully!');
                socket.emit('task_updated', { taskId, projectId });
            };
            const savePriorityTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return savePriorityTask(newToken);
                        }
                        throw new Error('Delete priority task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Priority',
                            old_value: task?.priority,
                            new_value: newPriority,
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            savePriorityTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// save status
    // const [showAnimation, setShowAnimation] = useState(false);
    const handleSaveStatus = async (newStatus) => {
        try {
            let dataSave = {
                status: newStatus
            };
            if (isViewer) {
                toast.error('You do not have permission to perform this action!');
                return;
            }
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
                    message: `${userData.displayName} has save status "${newStatus}" from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));

            if (newStatus === 'Completed') {
                dataSave = { ...dataSave, done_date: new Date().toISOString(), task_review_status: 'pending' };
            } else {
                dataSave = { ...dataSave, done_date: '1000-10-10T00:00:00.000+00:00', task_review_status: 'not requested' };
            }

            const handleSuccess = () => {
                console.log('Emitting task_updated event:', { taskId, projectId });
                // Emit task update event
                socket.emit('task_updated', { taskId, projectId });
            };

            const saveStatusTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return saveStatusTask(newToken);
                        }
                        throw new Error('Delete status task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Status',
                            old_value: task?.status,
                            new_value: newStatus,
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            await saveStatusTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// save Start Date 
    const handleSaveStartDate = (newStartDate) => {
        try {
            if (new Date(newStartDate) > new Date(task?.end_date)) {
                toast.error('Due date must be greater than start date!');
                return;
            }
            const dataSave = {
                start_date: newStartDate
            };
            const handleSuccess = () => {
                // toast.success('Update start date task successfully!');
                socket.emit('task_updated', { taskId, projectId });
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
                    message: `${userData.displayName} has Update start date from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));
            const saveStartDateTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return saveStartDateTask(newToken);
                        }
                        throw new Error('Delete start date task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Start Date',
                            old_value: dayjs(task?.start_date).format('MMM DD, hh:mm A'),
                            new_value: dayjs(newStartDate).format('MMM DD, hh:mm A'),
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            saveStartDateTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// save Due Date
    const handleSaveDueDate = (newDueDate) => {
        try {
            if (new Date(newDueDate) < new Date(task?.start_date)) {
                toast.error('Due date must be greater than start date!');
                return;
            }
            const dataSave = {
                end_date: newDueDate
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
                    message: `${userData.displayName} has Update end date from task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));
            const handleSuccess = () => {
                // toast.success('Update due date task successfully!');
                socket.emit('task_updated', { taskId, projectId });
            };
            const saveDueDateTask = async (token) => {
                try {
                    const resultAction = await dispatch(updateTaskThunks({
                        accesstoken: token,
                        taskId: taskId,
                        taskData: dataSave
                    }));
                    if (updateTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return saveDueDateTask(newToken);
                        }
                        throw new Error('Delete due date task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Due Date',
                            old_value: dayjs(task?.end_date).format('MMM DD, hh:mm A'),
                            new_value: dayjs(newDueDate).format('MMM DD, hh:mm A'),
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            task_id: taskId,
                            action: 'Update',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(getTaskByMemberIDThunk({ accesstoken: token, memberID: userData?._id }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            saveDueDateTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// check ID leave task
    const isAssignedToMe = (assignedToIdArray, userId) => {
        return assignedToIdArray?.some(item => item?.memberId?._id === userId);
    };

    /// leave task
    const findAssignedMember = (assignedToId, userId) => {
        const matchedItem = assignedToId?.find(item => item?.memberId?._id === userId);
        return matchedItem?._id || null; // Trả về _id hoặc null nếu không tìm thấy
    }

    const [openLeaveMember, setOpenLeaveMember] = useState(false);
    const [selectedLeaveMember, setSelectedLeaveMember] = useState(null);
    const handleLeaveMemberClick = (memberId) => {
        setSelectedLeaveMember(memberId);
        setOpenLeaveMember(true);
    };

    const handleConfirmLeaveMember = () => {
        try {
            const dataDelete = {
                _id: selectedLeaveMember,
                is_active: false
            };
            const handleSuccess = () => {
                toast.success('Leave task successfully!');
                setOpenLeaveMember(false);
                setSelectedLeaveMember(null);
                socket.emit('task_updated', { taskId, projectId });
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
                    type: 'leave_task',
                    message: `${userData.displayName} has left task ${task?.task_name} in project ${task?.project_id?.projectName}`
                }));

            const leaveMembers = async (token) => {
                try {
                    const resultAction = await dispatch(updateMemberTaskThunks({
                        accesstoken: token,
                        data: dataDelete
                    }));
                    if (updateMemberTaskThunks.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return leaveMembers(newToken);
                        }
                        throw new Error('Leave task failed');
                    }
                    await dispatch(createAuditLog({
                        accesstoken: token,
                        data: {
                            task_id: taskId,
                            action: 'Leave',
                            entity: 'Task',
                            user_id: userData?._id
                        }
                    }));
                    await dispatch(createAuditLog_project({
                        accesstoken: token,
                        data: {
                            project_id: projectId,
                            action: 'Leave',
                            entity: 'Task',
                            user_id: userData?._id,
                            task_id: taskId
                        }
                    }));
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
                    if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                    await dispatch(addNotification({ accesstoken: token, data: notificationData }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            leaveMembers(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };
    const handleCancelLeaveMember = () => {
        setOpenLeaveMember(false);
        setSelectedLeaveMember(null);
    }

    // Join project room when component mounts
    useEffect(() => {
        const joinRoom = () => {
            if (projectId) {
                console.log('ChangeList: Joining project room:', projectId);
                socket.emit('join_project_room', { projectId });
            }
        };

        const leaveRoom = () => {
            if (projectId) {
                console.log('ChangeList: Leaving project room:', projectId);
                socket.emit('leave_project_room', { projectId });
            }
        };

        // Listen for task review events
        const handleTaskReviewed = ({ taskId: reviewedTaskId }) => {
            if (reviewedTaskId === taskId) {
                console.log('ChangeList: Task reviewed:', reviewedTaskId);
                dispatch(fetchTaskById({ accesstoken, taskId }));
                dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
            }
        };

        const handleTaskUpdated = ({ taskId: updatedTaskId }) => {
            if (updatedTaskId === taskId) {
                console.log('ChangeList: Task updated:', updatedTaskId);
                dispatch(fetchTaskById({ accesstoken, taskId }));
                dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
            }
        };

        // Join room immediately
        joinRoom();

        // Set up event listeners
        socket.on('task_reviewed', handleTaskReviewed);
        socket.on('task_updated', handleTaskUpdated);

        // Cleanup function
        return () => {
            leaveRoom();
            socket.off('task_reviewed', handleTaskReviewed);
            socket.off('task_updated', handleTaskUpdated);
        };
    }, [taskId, projectId, accesstoken, userData?._id]);

    // Add a new useEffect to handle dialog close
    useEffect(() => {
        if (!open && projectId) {
            console.log('ChangeList: Dialog closed, rejoining project room:', projectId);
            socket.emit('join_project_room', { projectId });
        }
    }, [open, projectId]);

    return (
        <StyledDialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                style: { backgroundColor: theme.palette.background.paper },
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <EditableText 
                            isClickable={!isViewer} 
                            initialText={task?.task_name} 
                            onSave={handleSaveTitle} 
                            maxWidth="780px" 
                            titleColor="primary.main"
                            sx={{ 
                                fontSize: '1.25rem',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                    borderRadius: '8px',
                                }
                            }}
                        />
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1.5,
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                            padding: theme.spacing(0.75, 2),
                            borderRadius: '12px',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Task Review:
                            </Typography>
                            <TaskReview 
                                role={currentUserRole}
                                taskReview={task.task_review_status}
                                status={task.status}
                                onAccept={() => handleConfirmReviewTask('accept')}
                                onReject={() => handleConfirmReviewTask('reject')}
                            />
                        </Box>
                    </Box>
                    <IconButton 
                        onClick={onClose} 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                color: theme.palette.error.main,
                                transform: 'rotate(90deg)',
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Assignee</Typography>
                        {task?.assigned_to_id?.map(member => (
                            <Chip
                                key={member?.memberId?._id}
                                avatar={<Avatar sx={{ bgcolor: '#c9b458' }} src={member?.memberId?.image} />}
                                label={member?.memberId?.displayName}
                                onDelete={() => handleDeleteMemberClick(member?._id, member?.memberId?.displayName, member?.memberId?._id)}
                                sx={{ bgcolor: 'transparent', border: `1px solid ${theme.palette.text.secondary}` }}
                            />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Projects</Typography>
                        <Chip
                            label={task?.project_id?.projectName}
                            // onDelete={() => {}}
                            sx={{ color: theme.palette.text.primary }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Labels</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {task?.label_id?.map(lb => (
                                <Chip
                                    key={lb?._id}
                                    label={lb?.name}
                                    onDelete={() => handleDeleteLabelClick(lb?._id, lb?.name)}
                                    sx={{ bgcolor: `${lb?.color}`, p: 1, color: 'white' }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button onClick={handleOpenColorPicker} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                Add
                            </Button>
                        </Box>
                        <ColorPickerDialog open={openColorPicker} onClose={handleCloseColorPicker} taskId={taskId} userData={userData} isClickable={!isViewer} />
                        {/* {label.title && (
                            <p>Created Label: {label.title} (Color: {label.color})</p>
                        )} */}
                    </Box>

                    {/* <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Priority</Typography>
                            <Chip
                                label={task?.project_id?.projectName}
                                // onDelete={() => {}}
                                sx={{ color: theme.palette.text.primary }}
                            />
                        </Box>
                    </Box> */}

                    <PrioritySelector
                        value={task?.priority}
                        onChange={handleSavePriority}
                        isClickable={!isViewer}
                    />

                    <StatusSelector
                        value={task?.status}
                        onChange={handleSaveStatus}
                        isClickable={!isViewer}
                    />
                    {/* {showAnimation && <AnimationDone />} */}

                    <DueDatePicker
                        lableDate="Start Date"
                        onDateChange={handleSaveStartDate}
                        initialDate={task?.start_date}
                        isClickable={!isViewer}
                    />
                    <DueDatePicker
                        lableDate="Due Date"
                        onDateChange={handleSaveDueDate}
                        initialDate={task?.end_date}
                        isClickable={!isViewer}
                    />

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Attachments</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button onClick={handleOpenFile} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                    Add
                                </Button>
                            </Box>
                            <FileUploadDialog open={openFile} onClose={handleCloseFile} taskId={taskId} entityType={"Task"} isClickable={!isViewer} members={members} task={task} />
                        </Box>
                        <Box>
                            {files?.length > 0 && (files?.map((file, index) => (
                                <Box key={index} sx={{ ml: 3, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <InsertDriveFile sx={{ color: theme.palette.text.primary }} />
                                            <Box>
                                                <Typography sx={{ color: theme.palette.text.primary }}>{file?.originalName}</Typography>
                                                <Typography sx={{ color: theme.palette.text.secondary, fontSize: '0.8rem' }}>{formatFileSize(file?.size)}</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <FileManagementDialog fileManagement={file} userData={userData} taskId={taskId} isClickable={!isViewer} members={members} task={task}/>
                                    {/* <FileManagementDialogs open={openManagement} onClose={handleCloseManagement} /> */}
                                </Box>
                            )))}
                        </Box>


                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>Description</Typography>
                        <ProjectDescription isEditable={isViewer ? false : true} initialContent={task?.description} context={"descriptionTask"} taskId={taskId} members={members} task={task}/>
                    </Box>


                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Activity</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button
                                    sx={{ color: theme.palette.text.primary, textTransform: 'none' }}
                                    onClick={toggleDetails}
                                >
                                    {showDetails ? 'Hide details' : 'Show details'}
                                </Button>
                            </Box>
                        </Box>
                        {showDetails && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                    <ActivityLog activitys={task?.audit_log_id} />
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <SectionTitle variant="subtitle1">Comments</SectionTitle>
                        <ContentBox>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                <StyledAvatar 
                                    sx={{ 
                                        width: 40,
                                        height: 40,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    }} 
                                    src={userData?.image} 
                                />
                                <Box sx={{ flex: 1 }}>
                                    <ProjectDescription 
                                        initialContent={cmt} 
                                        isLabled={false} 
                                        context={"comment"} 
                                        taskId={taskId} 
                                        members={members} 
                                        task={task}
                                    />
                                </Box>
                            </Box>
                        </ContentBox>
                        {task?.comment_id && (
                            <Box sx={{ pl: '48px' }}>
                                <CommentList comments={task?.comment_id} taskId={taskId} />
                            </Box>
                        )}
                    </Box>

                    <ContentBox sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        p: 2,
                    }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Collaborators
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                            {task?.assigned_to_id?.map((user, index) => (
                                <StyledAvatar
                                    key={index}
                                    sx={{ 
                                        width: 32,
                                        height: 32,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    }}
                                    alt={user?.memberId?.displayName}
                                    src={user?.memberId?.image}
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                                />
                            ))}
                            {!isViewer && (
                                <StyledAvatar 
                                    onClick={handleOpenAvt} 
                                    sx={{ 
                                        width: 32,
                                        height: 32,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        color: theme.palette.primary.main,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                                        }
                                    }}
                                >
                                    +
                                </StyledAvatar>
                            )}
                        </Box>
                        {isAssignedToMe(task?.assigned_to_id, userData?._id) && (
                            <StyledButton
                                onClick={() => handleLeaveMemberClick(findAssignedMember(task?.assigned_to_id, userData?._id))}
                                sx={{ 
                                    color: theme.palette.error.main,
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.2),
                                        boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.15)}`,
                                    }
                                }}
                            >
                                Leave task
                            </StyledButton>
                        )}
                    </ContentBox>

                    <AddMemberDialog open={openAvt} onClose={handleCloseAvt} taskId={taskId} isClickable={!isViewer} taskData={task} />

                </Box>
            </DialogContent>

            {/* delete member */}
            <AlertLeave
                open={openMember}
                onClose={handleCancelDeleteMember}
                projectName="Confirm delete member"
                lable="Are you sure you want to delete member this task?"
                onConfirm={handleConfirmDeleteMember}
            />

            {/* delete label */}
            <AlertLeave
                open={openLabel}
                onClose={handleCancelDeleteLabel}
                projectName="Confirm delete label"
                lable="Are you sure you want to delete label this project?"
                onConfirm={handleConfirmDeleteLabel}
            />

            {/* leave project*/}
            <AlertLeave
                open={openLeaveMember}
                onClose={handleCancelLeaveMember}
                projectName="Confirm leave project"
                lable="Are you sure you want to leave this project?"
                onConfirm={handleConfirmLeaveMember}
            />
        </StyledDialog>
    );
};

export default ChangeList;