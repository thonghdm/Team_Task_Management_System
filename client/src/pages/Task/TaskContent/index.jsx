import React from 'react';
import { Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Calendar from '~/pages/Task/Calendar';
import TaskList from '~/pages/Task/MyTasks/TaskList';
import { useTheme } from '@mui/material/styles';


const TaskContent = () => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{ mt: 2, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
            <Routes>
                <Route path="/" element={<Navigate to="mytask" replace />} />
                <Route path="mytask" element={<TaskList />} />
                <Route path="calendar" element={<Calendar />} />
            </Routes>
        </Paper>
    );
};

export default TaskContent;
