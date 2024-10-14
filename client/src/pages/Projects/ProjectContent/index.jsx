import React from 'react';
import { Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '~/pages/Projects/Content/List';
import Overview from '~/pages/Projects/Content/Overview';

const ProjectContent = () => {
    const theme = useTheme();
    return (
        // <Paper elevation={3} sx={{ mt: 2, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
            <Routes>
                <Route path="/" element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<Overview />} />
                <Route path="list" element={<List />} />
            </Routes>
        // </Paper>
    );
};

export default ProjectContent;
