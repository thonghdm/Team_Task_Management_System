import React from 'react';
import { Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import Calendar from '~/Components/Calendar';
import TaskList from '~/pages/Task/MyTasks/TaskList';
import { useTheme } from '@mui/material/styles';
// import TextEditor from '~/Components/TextEditor';
import Note from '~/pages/Task/Note';
import CalendarMy from '~/pages/Task/MyTasks/CalendarMy';

const TaskContent = () => {
    const theme = useTheme();
    return (
        <Paper elevation={3} sx={{ mt: 2, p: 1, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
            <Routes>
                <Route path="/" element={<Navigate to="mytask" replace />} />
                <Route path="mytask" element={<TaskList />} />
                <Route path="calendar" element={<CalendarMy />} />
                {/* <Route path="texteditor" element={<TextEditor value={``} />} /> */}
                <Route path="texteditor" element={<Note />} />
            </Routes>
        </Paper>
    );
};

export default TaskContent;
