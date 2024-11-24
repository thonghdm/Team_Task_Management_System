import React from 'react';
import { Grid } from '@mui/material';
import StatsCard from '~/pages/Admin/DashBoards/Components/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';

const StatsGrid = () => {
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      subtext: '4 projects created this month',
      icon: <AssignmentIcon />,
      color: '#2196f3'
    },
    {
      title: 'Team Members',
      value: '12',
      subtext: '3 joined this month',
      icon: <GroupIcon />,
      color: '#4caf50'
    },
    {
      title: 'Tasks Completed',
      value: '156',
      subtext: '3 tasks created this month',
      icon: <CheckCircleIcon />,
      color: '#ff9800'
    },
    {
      title: 'In Progress',
      value: '8',
      subtext: 'Due this week',
      icon: <TimelineIcon />,
      color: '#f44336'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsGrid;
