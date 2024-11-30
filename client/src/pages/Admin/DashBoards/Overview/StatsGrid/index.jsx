import React from 'react';
import { Grid } from '@mui/material';
import StatsCard from '~/pages/Admin/DashBoards/Components/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';

import { useTheme } from '@mui/material';
const StatsGrid = ({ calProjects, calMembers }) => {
  const stats = [
    {
      title: 'Total Projects',
      value: calProjects.totalProjects,
      subtext: `${calProjects.projectsCreatedLastMonth} projects activity this month`,
      icon: <AssignmentIcon />,
      color: '#2196f3'
    },
    {
      title: 'Total Members',
      value: calMembers.totalInactiveNonAdminMembers,
      subtext: `${calMembers.totalMembersJoinedLastMonth} joined activity this month`,
      icon: <GroupIcon />,
      color: '#4caf50'
    },
    {
      title: 'Total Tasks',
      value: calProjects.totalTasks,
      subtext: `${calProjects.tasksCreatedLastMonth} tasks activity this month`,
      icon: <CheckCircleIcon />,
      color: '#ff9800'
    },
    {
      title: 'Total Lists',
      value: calProjects.totalLists,
      subtext: `${calProjects.listsCreatedLastMonth} lists activity this month`,
      icon: <TimelineIcon />,
      color: '#f44336'
    }
  ];
  const theme = useTheme();
  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard {...stat} background={theme.palette.background.paper} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;
