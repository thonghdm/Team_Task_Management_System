import React, { useCallback, useState, useEffect } from 'react';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    TextField,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    Backdrop
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { extractTasksInfo } from '~/utils/extractTasksInfo';
import { useDispatch, useSelector } from 'react-redux';
import { AiAssignTasks } from '~/apis/AI/chatWithAI';
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import { useParams } from 'react-router-dom';
import { inviteUserTask } from '~/redux/project/task-slice/task-inviteUser-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { createAuditLog } from '~/redux/project/auditLog-slice';
import { fetchTaskById } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
import { addNotification } from '~/redux/project/notifications-slice/index';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';




// Add helper function to check for existing members
const checkMemberIdExists = (newInvites, existingMembers) => {
    if (!existingMembers || !Array.isArray(existingMembers)) return false;
    
    return newInvites.some(newInvite => 
        existingMembers.some(existingMember => 
            existingMember.memberId === newInvite.memberId
        )
    );
};

const AIAssistant = ({ open, onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [assignments, setAssignments] = useState({ tasks: [] });
    const [editingCell, setEditingCell] = useState(null);
    const [getTasksInfo, setTasksInfo] = useState([]);
    const { projectData } = useSelector((state) => state.projectDetail);
    const { members } = useSelector((state) => state.memberProject);
    const { accesstoken, userData } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const { projectId } = useParams();
    const defaultAvatar = "/225-default-avatar.png";
    // Add permission check
    const isClickable = React.useMemo(() => {
        if (!members?.members || !userData?._id) return false;
        const currentMember = members.members.find(m => m.memberId._id === userData._id);
        return currentMember?.isRole === 'admin' || currentMember?.isRole === 'ProjectManager';
    }, [members, userData]);

    useEffect(() => {
        if (projectData) {
            const tasksInfo = extractTasksInfo(projectData?.project);
            setTasksInfo(tasksInfo);
        }
    }, [projectData]);
    useEffect(() => {
        dispatch(fetchMemberProject({ accesstoken, projectId }));
    }, [dispatch, projectId, accesstoken])

    const tasks = getTasksInfo.map(task => ({
        ...task,
        name: task.task_name || '.',
        list: task.list_name || '.',
        priority: task.priority || '.',
        members: task.members,
        start_date: task.start_date || task.created_at,
        end_date: task.end_date || task.due_date || task.created_at,
    }));

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa có';
        try {
            // Handle both ISO string and timestamp
            const date = typeof dateString === 'string' ? new Date(dateString) : new Date(parseInt(dateString));
            if (isNaN(date.getTime())) return 'Chưa có';

            // Format date in Vietnamese locale
            return date.toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Chưa có';
        }
    };

    const shortenId = (id) => {
        if (!id) return '';
        if (id.length <= 8) return id;
        return `${id.slice(0, 2)}...${id.slice(-5)}`;
    };

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            const formattedAssignments = {
                prompt: prompt,
                tasks: tasks.map(task => ({
                    task_id: task.id || task.task_id,
                    task_name: task.name || task.task_name,
                    list_name: task.list || task.list_name || ".",
                    priority: task.priority,
                    start_date: task.start_date,
                    end_date: task.end_date,
                    assigned_to: task.members || task.assigned_to || []
                })),
                members: member.map(m => ({
                    displayName: m.memberId.displayName,
                    username: m.memberId.username,
                    image: m.memberId.image,
                    isRole: m.isRole,
                    email: m.memberId.email,
                    memberId: { _id: m.memberId._id }
                }))
            };

            // Reset assignments before setting new ones
            setAssignments({ tasks: [] });

            // Send data to API
            const response = await AiAssignTasks(formattedAssignments);

            // Update assignments with the response data
            if (response?.assignments) {
                setAssignments({ tasks: response.assignments });
            }

        } catch (error) {
            console.error('Error getting AI assignments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const member = members?.members?.filter(user => user.is_active === true) || [];
    console.log(member);
    console.log(assignments);

    const handlePromptChange = (e) => {
        setPrompt(e.target.value);
    };

    const handleCellEdit = (taskId, memberId, isAdding = false) => {
        setEditingCell({ taskId, memberId, isAdding });
    };

    const handleCellSave = (taskId, memberId, newMemberId) => {
        setAssignments(prevAssignments => {
            return {
                tasks: prevAssignments.tasks.map(task => {
                    if (task.task_id === taskId) {
                        if (editingCell.isAdding) {
                            // Add new member
                            const newMember = member.find(m => m.memberId._id === newMemberId);
                            return {
                                ...task,
                                assigned_to: [...task.assigned_to, {
                                    memberId: newMember.memberId._id,
                                    displayName: newMember.memberId.displayName,
                                    username: newMember.memberId.username,
                                    email: newMember.memberId.email || '',
                                    image: newMember.memberId.image
                                }]
                            };
                        } else {
                            return {
                                ...task,
                                assigned_to: task.assigned_to.map(m =>
                                    m.memberId === memberId
                                        ? {
                                            ...m,
                                            memberId: newMemberId,
                                            displayName: member.find(mm => mm.memberId._id === newMemberId)?.memberId.displayName
                                        }
                                        : m
                                )
                            };
                        }
                    }
                    return task;
                })
            };
        });
        setEditingCell(null);
    };

    const handleRemoveMember = (taskId, memberId) => {
        setAssignments(prevAssignments => {
            return {
                tasks: prevAssignments.tasks.map(task => {
                    if (task.task_id === taskId) {
                        return {
                            ...task,
                            assigned_to: task.assigned_to.filter(m => m.memberId !== memberId)
                        };
                    }
                    return task;
                })
            };
        });
    };

    const refreshToken = useRefreshToken();

    const handleSave = async () => {
        try {
            setIsSaving(true);
            // Validation
            if (!assignments.tasks || assignments.tasks.length === 0) {
                toast.error('No tasks to save');
                return;
            }

            if (!isClickable) {
                toast.error("You don't have permission to assign members to tasks. Only project managers and admins can do this.");
                return;
            }

            // Process all tasks and their assigned members
            const processTasks = async (token) => {
                try {
                    // Validate required data
                    if (!userData?._id || !userData?.username) {
                        console.error('Missing user data:', { userData });
                        toast.error('User data is missing');
                        return;
                    }

                    if (!projectId) {
                        console.error('Missing project ID');
                        toast.error('Project ID is missing');
                        return;
                    }

                    // Collect all user invites across all tasks
                    const allUserInvites = [];
                    const allNotificationData = [];
                    const allAuditLogs = [];

                    for (const task of assignments.tasks) {
                        try {
                            if (!task.task_id || !task.assigned_to) {
                                console.error('Invalid task data:', task);
                                toast.error(`Invalid task data for task: ${task.task_name || 'Unknown'}`);
                                continue;
                            }

                            // Format data for each task
                            const taskUserInvites = task.assigned_to.map(member => {
                                if (!member.memberId || !member.displayName) {
                                    console.error('Invalid member data:', member);
                                    throw new Error(`Invalid member data for task: ${task.task_name}`);
                                }
                                return {
                                    memberId: member.memberId,
                                    task_id: task.task_id,
                                    user_invite: userData._id,
                                    user_name_invite: userData.username,
                                    user_name: member.displayName,
                                    user_email: member.email || ''
                                };
                            });

                            // Check existing members for this task
                            if (checkMemberIdExists(taskUserInvites, task?.assigned_to_id)) {
                                toast.error(`One or more users already exist in task: ${task.task_name}`);
                                continue;
                            }

                            // Add the invites for this task
                            allUserInvites.push(...taskUserInvites);

                            // Prepare notification data for this task
                            const taskNotificationData = task.assigned_to.map(member => ({
                                senderId: userData._id,
                                receiverId: member.memberId,
                                projectId: projectId,
                                taskId: task.task_id,
                                type: 'task_invite',
                                message: `You have been invited to the task ${task.task_name} in project ${projectData?.project?.projectName || 'Unknown Project'}`
                            }));
                            allNotificationData.push(...taskNotificationData);

                            // Prepare audit log for this task
                            allAuditLogs.push({
                                task_id: task.task_id,
                                action: 'Add',
                                entity: 'Member',
                                old_value: task.assigned_to.map(member => member.displayName).join(','),
                                user_id: userData._id
                            });
                        } catch (taskError) {
                            console.error('Error processing task:', {
                                task: task.task_name,
                                error: taskError.message,
                                taskData: task
                            });
                            toast.error(`Error processing task: ${task.task_name || 'Unknown'}`);
                            continue;
                        }
                    }

                    if (allUserInvites.length === 0) {
                        toast.error('No valid assignments to save');
                        return;
                    }

                    // Invite all users to their respective tasks
                    const resultAction = await dispatch(inviteUserTask({
                        accesstoken: token,
                        data: allUserInvites
                    }));

                    if (inviteUserTask.rejected.match(resultAction)) {
                        console.error('Invite task rejected:', resultAction.payload);
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return processTasks(newToken);
                        }
                        throw new Error(`Invite members failed: ${resultAction.payload?.message || 'Unknown error'}`);
                    }

                    // Create audit logs for all tasks
                    for (const auditLog of allAuditLogs) {
                        try {
                            await dispatch(createAuditLog({
                                accesstoken: token,
                                data: auditLog
                            }));
                        } catch (auditError) {
                            console.error('Error creating audit log:', auditLog, auditError);
                        }
                    }

                    // Create project audit log for each task separately
                    for (const task of assignments.tasks) {
                        try {
                            await dispatch(createAuditLog_project({
                                accesstoken: token,
                                data: {
                                    project_id: projectId,
                                    action: 'Update',
                                    entity: 'Task',
                                    user_id: userData._id,
                                    task_id: task.task_id
                                }
                            }));
                        } catch (projectAuditError) {
                            console.error('Error creating project audit log for task:', task.task_id, projectAuditError);
                        }
                    }

                    try {
                        await dispatch(addNotification({ 
                            accesstoken: token, 
                            data: allNotificationData 
                        }));
                    } catch (notificationError) {
                        console.error('Error sending notifications:', notificationError);
                    }

                    // Refresh project and task data
                    try {
                        await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                        for (const task of assignments.tasks) {
                            await dispatch(fetchTaskById({ accesstoken: token, taskId: task.task_id }));
                        }
                    } catch (refreshError) {
                        console.error('Error refreshing data:', refreshError);
                    }

                    toast.success('Successfully assigned members to tasks!');
                    onClose();
                } catch (error) {
                    toast.error(`Failed to save assignments: ${error.message || 'Unknown error'}`);
                    throw error;
                } finally {
                    setIsSaving(false);
                    handleClearData();
                }
            };

            await processTasks(accesstoken);
        } catch (error) {
            toast.error(`An error occurred while saving assignments: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClearData = () => {
        setAssignments({ tasks: [] });
        setPrompt("");
    };

    const handleClose = () => {
        setPrompt("");
        setAssignments({ tasks: [] });
        setEditingCell(null);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={isLoading || isSaving ? undefined : handleClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                AI Task Assignment Assistant
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    disabled={isLoading || isSaving}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            {/* AI Loading Overlay */}
            {(isLoading || isSaving) && (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        position: 'absolute',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                    }}
                    open={isLoading || isSaving}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            color: 'primary.main'
                        }}
                    >
                        <CircularProgress size={60} thickness={4} />
                        <Typography variant="h6" color="primary.main">
                            {isLoading 
                                ? "AI is analyzing tasks and assigning members..." 
                                : "Saving task assignments..."
                            }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            This may take a few moments
                        </Typography>
                    </Box>
                </Backdrop>
            )}

            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body1" gutterBottom>
                        Enter a prompt for AI to analyze and assign tasks to team members.
                    </Typography>

                    <Box sx={{ mb: 3, display: 'flex' }}>
                        <TextField
                            fullWidth
                            label="Enter your AI prompt"
                            variant="outlined"
                            value={prompt}
                            onChange={handlePromptChange}
                            placeholder="E.g., Assign tasks based on team members' expertise and current workload"
                            disabled={isLoading || isSaving}
                            sx={{ mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading || isSaving || !prompt.trim()|| assignments.tasks?.length > 0}
                            sx={{ mr: 1 }}
                            
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Get Suggestions"}
                        </Button>
                        {assignments.tasks?.length > 0 && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSave}
                                    startIcon={<SaveIcon />}
                                    disabled={isLoading || isSaving}
                                    sx={{ mr: 1 }}
                                >
                                    {isSaving ? <CircularProgress size={20} /> : "Save Changes"}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClearData}
                                    startIcon={<DeleteIcon />}
                                    disabled={isLoading || isSaving}
                                >
                                    Clear
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>

                {assignments.tasks?.length > 0 ? (
                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader aria-label="task assignments table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Task ID</TableCell>
                                    <TableCell>Task Name</TableCell>
                                    <TableCell>Priority</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell>Assigned Members</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignments.tasks?.map((task) => (
                                    <TableRow key={task.task_id}>
                                        <TableCell>{shortenId(task.task_id)}</TableCell>
                                        <TableCell>{task.task_name}</TableCell>
                                        <TableCell>{task.priority}</TableCell>
                                        <TableCell>{formatDate(task.start_date)}</TableCell>
                                        <TableCell>{formatDate(task.end_date)}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {task.assigned_to.map((member) => (
                                                    <Chip
                                                        key={member.memberId}
                                                        label={member.displayName + " (" + (member.username || "NU") + ")"}
                                                        avatar={<Avatar src={member.image || defaultAvatar} />}
                                                        onDelete={isSaving ? undefined : () => handleRemoveMember(task.task_id, member.memberId)}
                                                        sx={{
                                                            m: 0.5,
                                                            '& .MuiChip-avatar': {
                                                                width: 24,
                                                                height: 24,
                                                                fontSize: '0.875rem'
                                                            }
                                                        }}
                                                    />
                                                ))}
                                                {editingCell?.taskId === task.task_id && editingCell?.isAdding ? (
                                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                                        <Select
                                                            value=""
                                                            onChange={(e) => handleCellSave(task.task_id, null, e.target.value)}
                                                            displayEmpty
                                                            disabled={isSaving}
                                                        >
                                                            <MenuItem value="" disabled>Select Member</MenuItem>
                                                            {member.filter(m =>
                                                                m.is_active === true &&
                                                                !task.assigned_to.some(assigned => assigned.memberId === m.memberId._id)
                                                            ).map((m) => (
                                                                <MenuItem key={m.memberId._id} value={m.memberId._id}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                        <Avatar
                                                                            src={m.memberId.image}
                                                                            sx={{ width: 24, height: 24 }}
                                                                        />
                                                                        <Box>
                                                                            <Typography variant="body2">{m.memberId.displayName}</Typography>
                                                                            <Typography variant="caption" color="text.secondary">
                                                                                {m.memberId.username}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                ) :
                                                member.some(m =>
                                                    m.is_active &&
                                                    !task.assigned_to.some(assigned => assigned.memberId === m.memberId._id)
                                                  ) 
                                                && (
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleCellEdit(task.task_id, null, true)}
                                                        disabled={isSaving}
                                                    >
                                                        Add
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, bgcolor: '#f5f5f5' }}>
                        <Typography variant="body1" color="text.secondary">
                            Enter a prompt and click "Get AI Suggestions" to see task assignments
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" disabled={isLoading || isSaving}>
                    Close
                </Button>
            </DialogActions>
            <ToastContainer />
        </Dialog>
    );
};

export default AIAssistant;


// I want list_name: "Learning" is not needed to do so there is no need to assign it to team members to do, ignore this list_name