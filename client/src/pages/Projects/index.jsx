import React from 'react';
import { Box, Typography, Paper, IconButton, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import ProjectContent from '~/pages/Projects/ProjectContent';

const Projects = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isOvewViewActive = location.pathname.endsWith('/overview');
  const isListActive = location.pathname.endsWith('/list');
  const isBoardActive = location.pathname.endsWith('/board');



  const isCalendarActive = location.pathname.endsWith('/calendar');
  const isTextEditorActive = location.pathname.endsWith('/texteditor');

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: 'grey.50', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">My tasks</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: 'text.primary' }}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default Projects;