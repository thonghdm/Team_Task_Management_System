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
    Avatar
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


const AIAssistant = ({ open, onClose }) => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [assignments, setAssignments] = useState({ tasks: [] });
    const [editingCell, setEditingCell] = useState(null);
    const [getTasksInfo, setTasksInfo] = useState([]);
    const { projectData } = useSelector((state) => state.projectDetail);
    const { members } = useSelector((state) => state.memberProject);
    const { accesstoken, userData } = useSelector(state => state.auth);
    const [responseAi, setResponseAi] = useState([]);
    const dispatch = useDispatch();
    const { projectId } = useParams();
    

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

    useEffect(() => {
       console.log(assignments);
    }, [assignments]);

    const handleSaveChanges = async () => {
        try {
            // Send data directly without wrapping in array
            const response = await AiAssignTasks(assignments);
            setResponseAi(response);
        } catch (error) {
            console.error('Error saving assignments:', error);
        }
    };
    console.log(assignments);

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
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                AI Task Assignment Assistant
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                            sx={{ mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt.trim()}
                            sx={{ mr: 1 }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Get AI Suggestions"}
                        </Button>
                        {assignments.tasks?.length > 0 && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleSaveChanges}
                                    startIcon={<SaveIcon />}
                                    sx={{ mr: 1 }}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleClearData}
                                    startIcon={<DeleteIcon />}
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
                                                        avatar={<Avatar src={member.image} />}
                                                        onDelete={() => handleRemoveMember(task.task_id, member.memberId)}
                                                        sx={{ m: 0.5,
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
                                                        >
                                                            <MenuItem value="" disabled>Select Member</MenuItem>
                                                            {member.filter(m => 
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
                                                ) : (
                                                    <Button
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleCellEdit(task.task_id, null, true)}
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
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AIAssistant;


// I want list_name: "Learning" is not needed to do so there is no need to assign it to team members to do, ignore this list_name