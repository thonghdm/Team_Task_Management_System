import React from 'react';
import { Paper } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import TaskBoard from '~/pages/Projects/Content/TaskBoard';
import Overview from '~/pages/Projects/Content/Overview';
import Board from '~/pages/Projects/Content/Board';
import mockData from '~/apis/mockData';

import Calendar from '~/pages/Projects/Content/Calendar';
import Timeline from '~/pages/Projects/Content/Timeline';

import DashBoard from '~/pages/Projects/Content/DashBoard';
import AuditLog from '~/pages/Projects/Content/AuditLog';
const ProjectContent = () => {
    const theme = useTheme();
    return (
        // <Paper elevation={3} sx={{ mt: 2, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
        <Routes>
            <Route path="/" element={<Navigate to="task-board" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="task-board" element={<TaskBoard />} />
            {/* <Route path="task-board/:taskId" element={
                <ChangeList
                    open={true}  // Hoặc quản lý bằng state
                    onClose={handleGoBack} // Quay về task board khi đóng
                />
            } /> */}
            <Route path="project-board" element={<Board board={mockData} />} />
            <Route path="project-calendar" element={<Calendar />} />

            <Route path="project-timeline" element={<Timeline />} />
            
            <Route path="project-dashboard" element={<DashBoard />} />
            <Route path="audit-log" element={<AuditLog auditLogs={mockData.auditLogs} />} />
        </Routes>
        // </Paper>
    );
};

export default ProjectContent;
