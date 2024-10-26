import React, { useState, memo, useEffect } from 'react';
import { Dialog, Box, DialogContent, DialogTitle, DialogActions, Button, List, ListItem, ListItemText, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DueDatePicker from '~/Components/DueDatePicker';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { createNew } from '~/apis/Project/listService'
import { createNewTask } from '~/apis/Project/taskService'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { getListIDProjectDetails } from '~/utils/getListIDProjectDetails';
import { getProjectDetal } from '~/apis/Project/projectService'
import { fetchProjectDetail,resetProjectDetail } from '~/redux/project/projectDetail-slide';

const DialogButtonAdd = ({ open, onClose }) => {
    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);

    const [tasks, setTasks] = useState(['Task', 'List']);
    const [newTaskName, setNewTaskName] = useState('');
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const dispatch = useDispatch();
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleDueDateChange = (date) => {
        setDueDate(date);
    };
    const { projectId } = useParams();

    const [getNameIdList, setNameIdList] = useState([]);
    const { accesstoken, userData } = useSelector(state => state.auth)
    const [error, setError] = useState(null);
    
    
    const { projectData } = useSelector((state) => state.projectDetail);
    useEffect(() => {
        dispatch(fetchProjectDetail({ accesstoken, projectId }));
        return () => {
          dispatch(resetProjectDetail());
        };
      }, [dispatch, projectId, accesstoken,newListName]);
      console.log("2",projectData);

    useEffect(() => {
        if (projectData) {
          const tasksInfo = getListIDProjectDetails(projectData);
          setNameIdList(tasksInfo.lists);
        }
      }, [projectData]);
    
    const handleAddTaskDialogOpen = () => {
        onClose();  // Đóng Dialog chính
        setAddTaskDialogOpen(true);
    };

    const handleAddTaskDialogClose = () => setAddTaskDialogOpen(false);

    const handleAddListDialogOpen = () => {
        onClose();  // Đóng Dialog chính
        setAddListDialogOpen(true);
    };

    const handleAddListDialogClose = () => setAddListDialogOpen(false);

    // refresh token die
    const refreshToken = useRefreshToken();
    //

    // bt add task
    const handleAddTask = async () => {
        if (!newTaskName || !selectedList) {
            toast.error('Task name or list is missing!');
            return;
        }
        if (new Date(startDate) > new Date(dueDate)) {
            toast.error('Start date must be before equal or due date!');
            return;
        }
        const taskData = {
            task_name: newTaskName,
            list_id: selectedList,
            created_by_id: userData._id,
            project_id: projectId,
            start_date: startDate,
            due_date: dueDate,
        };

        const resetFormState = () => {
            setNewTaskName('');
            handleAddListDialogClose();
        };

        const handleSuccess = (message) => {
            toast.success(message || 'Task created successfully!');
            resetFormState();
        };

        const createTask = async (token) => {
            try {
                const response = await createNewTask(token, taskData);
                dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
                handleSuccess(response.message);
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshToken();
                    return createTask(newToken);
                }
                throw error;
            }
        };

        try {
            await createTask(accesstoken);

        } catch (error) {
            toast.error('Error creating task!' || error.response?.data.message);
        }
    };


    /// button submit add list
    const handleAddList = async () => {
        if (!newListName) {
            toast.error('List name is missing!');
            return;
        }
        const listData = {
            list_name: newListName,
            created_by_id: userData._id,
            project_id: projectId,
        };
        const resetFormState = () => {
            setNewListName('');
            handleAddListDialogClose();
        };
        const handleSuccess = (message) => {
            toast.success(message || 'List created successfully!');
            resetFormState();
        };

        const createList = async (token) => {
            try {
                const response = await createNew(token, listData);
                handleSuccess(response.message);
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshToken();
                    return createList(newToken);
                }
                throw error;
            }
        };

        try {
            await createList(accesstoken);
        } catch (error) {
            toast.error(error.response?.data.message || 'Error creating list!');
        }

    };
    ////

    return (
        <>
            {/* Main Dialog with Task List */}
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                PaperProps={{
                    style: {
                        position: 'absolute',
                        bottom: "10%",
                        left: "25%",
                        margin: 0,
                    },
                }}
            >
                <DialogContent style={{ padding: "0", width: "200px" }}>
                    <List>
                        {tasks.map((task, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={index === 0 ? handleAddTaskDialogOpen : handleAddListDialogOpen}
                            >
                                <ListItemText primary={task} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            {/* Add Task Dialog */}
            <Dialog
                open={addTaskDialogOpen}
                onClose={handleAddTaskDialogClose}
                maxWidth="sm"

                PaperProps={{
                    style: {
                        position: 'absolute',
                        bottom: "10%",
                        left: "25%",
                        margin: 0,
                    },
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: "bold" }}>Add task</DialogTitle>
                <DialogContent style={{ width: "300px" }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Enter a name for this card"
                    />
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>List</InputLabel>
                        <Select
                            value={selectedList}
                            onChange={(e) => setSelectedList(e.target.value)}
                            label="List"
                        >
                            {getNameIdList.map((list) => (
                                <MenuItem key={list.listId} value={list.listId}>
                                    {list.listName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <DueDatePicker lableDate={"Start date"} onDateChange={handleStartDateChange} />
                    <Box sx={{ mt: 2 }} />
                    <DueDatePicker lableDate={"Due date"} onDateChange={handleDueDateChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddTaskDialogClose}>Cancel</Button>
                    <Button onClick={handleAddTask} variant="contained" color="primary">
                        Add card
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add List Dialog */}
            <Dialog
                open={addListDialogOpen}
                onClose={handleAddListDialogClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    style: {
                        position: 'absolute',
                        bottom: "10%",
                        left: "25%",
                        margin: 0,
                    },
                }}>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: "bold" }}>Add list</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        fullWidth
                        variant="outlined"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Enter list name..."
                    />
                    {/* <FormControl fullWidth variant="outlined" margin="normal">
                            <InputLabel>Position</InputLabel>
                            <Select
                                value={8}
                                label="Position"
                            >
                                <MenuItem value={8}>8</MenuItem>
                            </Select>
                        </FormControl> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddListDialogClose}>Cancel</Button>
                    <Button onClick={handleAddList} variant="contained" color="primary">
                        Add List
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </>
    );
};
export default DialogButtonAdd
