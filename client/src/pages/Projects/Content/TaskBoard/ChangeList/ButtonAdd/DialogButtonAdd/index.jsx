import React, { useState } from 'react';
import { Dialog, Box, DialogContent, DialogTitle, DialogActions, Button, List, ListItem, ListItemText, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DueDatePicker from '~/Components/DueDatePicker';

const DialogButtonAdd = ({ open, onClose }) => {
    const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
    const [addListDialogOpen, setAddListDialogOpen] = useState(false);

    const [tasks, setTasks] = useState(['Task', 'List']);
    const [newTaskName, setNewTaskName] = useState('');
    const [newListName, setNewListName] = useState('');
    const [selectedList, setSelectedList] = useState('');
    const [startDate, setStartDate] = useState('');
    const [dueDate, setDueDate] = useState('');

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

    const handleAddTask = () => {
        if (newTaskName) {
            setTasks([...tasks, newTaskName]);
            setNewTaskName('');
            handleAddTaskDialogClose();
        }
    };

    const handleAddList = () => {
        if (newListName) {
            console.log(`New list added: ${newListName}`);
            setNewListName('');
            handleAddListDialogClose();
        }
    };

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
                            <MenuItem value="">
                                <em>.</em>
                            </MenuItem>
                            <MenuItem value="list1">List 1</MenuItem>
                            <MenuItem value="list2">List 2</MenuItem>
                        </Select>
                    </FormControl>

                    <DueDatePicker lableDate={"Start date"} />
                    <Box sx={{ mt: 2 }} />
                    <DueDatePicker lableDate={"Due date"} />
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
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Position</InputLabel>
                        <Select
                            value={8}
                            label="Position"
                        >
                            <MenuItem value={8}>8</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddListDialogClose}>Cancel</Button>
                    <Button onClick={handleAddList} variant="contained" color="primary">
                        Add List
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogButtonAdd;
