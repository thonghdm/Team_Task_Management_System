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
import FileManagementDialogs from '~/Components/FileManagementDialogs';
import AddMemberDialog from '~/Components/AddMemberDialog';
import { fetchTaskById } from '~/redux/project/task-slice';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import PrioritySelector from './PrioritySelector';
import StatusSelector from './StatusSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

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

// import AnimationDone from '~/Components/AnimationDone';

const activities = [
    { avatar: "LV", name: "Luyên Lê Văn", action: "created this task", timestamp: "Yesterday at 12:34am" },
    { avatar: "JD", name: "John Doe", action: "updated the description", timestamp: "2 hours ago" },
    // ... more activities
];
const ChangeList = ({ open, onClose, taskId }) => {
    const theme = useTheme();
    const [cmt, setCMT] = useState("Write a comment");
    const dispatch = useDispatch();

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
    const handleDeleteMemberClick = (memberId) => {
        setSelectedMember(memberId);
        setOpenMember(true);
    };

    /// delete label
    const [openLabel, setOpenLabel] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState(null);
    const handleDeleteLabelClick = (labelId) => {
        setSelectedLabel(labelId);
        setOpenLabel(true);
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
                is_active: false
            };
            const handleSuccess = () => {
                toast.success('Delete member successfully!');
                setOpenMember(false);
                setSelectedMember(null);
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
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
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
    };

    // delete label
    const handleConfirmDeleteLabel = () => {
        try {
            const dataDelete = {
                _id: selectedLabel,
                is_active: false
            };
            const handleSuccess = () => {
                toast.success('Delete label successfully!');
                setOpenLabel(false);
                setSelectedLabel(null);
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
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
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
    };

    /// save task name
    const handleSaveTitle = (newText) => {
        try {
            const dataSave = {
                task_name: newText
            };
            const handleSuccess = () => {
                // toast.success('Update title task successfully!');
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
                    await dispatch(fetchProjectDetail({ accesstoken, projectId }));
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
            const handleSuccess = () => {
                // toast.success('Update priority task successfully!');
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
                    await dispatch(fetchProjectDetail({ accesstoken, projectId }));
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
    const handleSaveStatus = (newStatus) => {
        try {
            const dataSave = {
                status: newStatus
            };
            const handleSuccess = () => {
                // toast.success('Update status task successfully!');
                // if (newStatus === 'Completed') {
                //     setShowAnimation(true);
                //     setTimeout(() => setShowAnimation(false), 2000); // Hide animation after 2 seconds
                //   }
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
                    await dispatch(fetchProjectDetail({ accesstoken, projectId }));
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            saveStatusTask(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    /// save Start Date 
    const handleSaveStartDate = (newStartDate) => {
        try {
            const dataSave = {
                start_date: newStartDate
            };
            const handleSuccess = () => {
                // toast.success('Update start date task successfully!');
            };
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
                    await dispatch(fetchProjectDetail({ accesstoken, projectId }));
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
            const handleSuccess = () => {
                // toast.success('Update due date task successfully!');
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
                    await dispatch(fetchProjectDetail({ accesstoken, projectId }));
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
        return assignedToIdArray.some(item => item.memberId?._id === userId);
    };

    /// leave task
    const findAssignedMember = (assignedToId, userId) => {
        const matchedItem = assignedToId.find(item => item.memberId?._id === userId);
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
            };
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
                    await dispatch(fetchTaskById({ accesstoken: token, taskId }));
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

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg" // loại bỏ giới hạn chiều rộng mặc định
            PaperProps={{
                style: { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary },
            }}
            className="scrollable"
            sx={{ maxHeight: '800px!important' }}
        >
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* <Typography variant="h6">{task?.task_name}</Typography> */}
                    <Typography >
                        <EditableText initialText={task?.task_name} onSave={handleSaveTitle} maxWidth="780px" titleColor="primary.main" />
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ width: '100px' }}>Assignee</Typography>
                        {task?.assigned_to_id?.map(member => (
                            <Chip
                                key={member?.memberId?._id}
                                avatar={<Avatar sx={{ bgcolor: '#c9b458' }} src={member?.memberId?.image} />}
                                label={member?.memberId?.displayName}
                                onDelete={() => handleDeleteMemberClick(member?._id)}
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
                        <Typography sx={{ width: '100px' }}>Lables</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1}}>
                            {task?.label_id?.map(lb => (
                                <Chip
                                    key={lb?._id}
                                    label={lb?.name}
                                    onDelete={() => handleDeleteLabelClick(lb?._id)}
                                    sx={{ bgcolor: `${lb?.color}`, p: 1, color: theme.palette.text.primary }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ marginLeft: 'auto' }}>
                            <Button onClick={handleOpenColorPicker} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                Add
                            </Button>
                        </Box>
                        <ColorPickerDialog open={openColorPicker} onClose={handleCloseColorPicker} taskId={taskId} />
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
                    />

                    <StatusSelector
                        value={task?.status}
                        onChange={handleSaveStatus}
                    />
                    {/* {showAnimation && <AnimationDone />} */}

                    <DueDatePicker
                        lableDate="Start Date"
                        onDateChange={handleSaveStartDate}
                        initialDate={task?.start_date}
                    />
                    <DueDatePicker
                        lableDate="Due Date"
                        onDateChange={handleSaveDueDate}
                        initialDate={task?.end_date}
                    />

                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ width: '100px' }}>Attachments</Typography>
                            <Box sx={{ marginLeft: 'auto' }}>
                                <Button onClick={handleOpenFile} startIcon={<Add />} sx={{ color: theme.palette.text.primary, textTransform: 'none' }}>
                                    Add
                                </Button>
                            </Box>
                            <FileUploadDialog open={openFile} onClose={handleCloseFile} taskId={taskId} entityType={"Task"} />
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
                                    <FileManagementDialog fileManagement={file} />
                                    {/* <FileManagementDialogs open={openManagement} onClose={handleCloseManagement} /> */}
                                </Box>
                            )))}
                        </Box>


                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>Description</Typography>
                        <ProjectDescription initialContent={task?.description} context={"descriptionTask"} taskId={taskId} />
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
                                    <ActivityLog activitys={activities} />
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography>Comments</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <Avatar sx={{ bgcolor: '#c9b458', width: 30, height: 30, fontSize: '0.8rem' }} src={userData?.image} />
                        <Box
                            sx={{
                                border: `1px solid ${theme.palette.background.paper}`,
                                backgroundColor: theme.palette.background.default,
                                borderRadius: '8px',
                                padding: 2,
                                width: '100%',
                                padding: "8px!important"
                            }}
                        >
                            <ProjectDescription initialContent={cmt} isLabled={false} context={"comment"} taskId={taskId} />
                        </Box>
                    </Box>

                    <CommentList comments={task?.comment_id} taskId={taskId} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption">Collaborators</Typography>
                        {task?.assigned_to_id
                            ?.map((user, index) => (
                                <Avatar
                                    sx={{ bgcolor: '#c9b458', width: 28, height: 28, fontSize: '0.7rem' }}
                                    key={index}
                                    alt={user?.memberId?.displayName}
                                    src={user?.memberId?.image}
                                    onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                                />
                            ))}

                        <Avatar onClick={handleOpenAvt} sx={{ bgcolor: theme.palette.background.default, color: theme.palette.text.primary, width: 28, height: 28, fontSize: '0.7rem', cursor: 'pointer' }}>+</Avatar>
                        {isAssignedToMe(task?.assigned_to_id, userData?._id) &&
                            <Button
                                onClick={() => handleLeaveMemberClick(findAssignedMember(task?.assigned_to_id, userData?._id))}
                                sx={{ color: theme.palette.text.primary, background: '#F88379', ml: 'auto' }}>Leave task</Button>
                        }
                    </Box>

                    <AddMemberDialog open={openAvt} onClose={handleCloseAvt} taskId={taskId} />
                </Box>
            </DialogContent>

            {/* delete member */}
            <AlertLeave
                open={openMember}
                onClose={handleCancelDeleteMember}
                projectName="Confirm delete member"
                lable="Are you sure you want to delete member this project?"
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
        </Dialog>
    );
};

export default ChangeList;