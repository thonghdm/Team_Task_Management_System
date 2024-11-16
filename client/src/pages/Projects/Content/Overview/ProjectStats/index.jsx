import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, Grid, Box, Select, MenuItem } from '@mui/material';
import { Assignment, Code } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GppBadIcon from '@mui/icons-material/GppBad';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';

const StatItem = ({ icon: Icon, value, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
    <Icon sx={{ mr: 1, color: 'text.secondary' }} />
    <Box>
      <Typography variant="h6" component="div">{value}</Typography>
      <Typography sx={{ fontSize: 12 }} color="text.secondary">{label}</Typography>
    </Box>
  </Box>
);

const ProjectStats = ({ project }) => {
  const theme = useTheme();
  const [period, setPeriod] = useState('last7days');

  const stats = useMemo(() => {
    if (!project || !project.lists) return {
      created: 0,
      completed: 0,
      todo: 0,
      inProgress: 0
    };

    const now = new Date();
    const periodDates = {
      last7days: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      last30days: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      last3months: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    };

    const cutoffDate = periodDates[period];

    // Flatten all tasks from all lists
    const allTasks = project.lists.reduce((acc, list) => {
      return acc.concat(list.tasks || []);
    }, []);

    // Filter tasks by period
    const tasksInPeriod = allTasks.filter(task => {
      const createdAt = new Date(task.createdAt);
      return createdAt >= cutoffDate;
    });
    return {
      created: tasksInPeriod.length,
      completed: tasksInPeriod.filter(task => task.status === "Completed").length,
      todo: tasksInPeriod.filter(task => task.status === "To Do").length,
      inProgress: tasksInPeriod.filter(task => task.status === "In Progress").length
    };
  }, [project, period]);
  
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Project stats
        </Typography>
        <Select
          value={period}
          onChange={handlePeriodChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="last7days">Last 7 days</MenuItem>
          <MenuItem value="last30days">Last 30 days</MenuItem>
          <MenuItem value="last3months">Last 3 months</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatItem icon={NoteAddIcon} value={stats.created} label="Work items created" />
        </Grid>
        <Grid item xs={6}>
          <StatItem icon={AssignmentTurnedInIcon} value={stats.completed} label="Work items completed" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatItem icon={GppBadIcon} value={stats.todo} label="Work items to do" />
        </Grid>
        <Grid item xs={6}>
          <StatItem icon={PublishedWithChangesIcon} value={stats.inProgress} label="Work items in progress" />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectStats;