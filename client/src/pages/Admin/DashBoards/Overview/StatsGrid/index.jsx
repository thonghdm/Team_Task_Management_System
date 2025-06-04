import React from 'react';
import { Grid, useTheme, alpha } from '@mui/material';
import { styled } from '@mui/material/styles';
import StatsCard from '~/pages/Admin/DashBoards/Components/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
}));

const StatsGrid = ({ calProjects, calMembers }) => {
  const theme = useTheme();
  
  const getGradientColor = (startColor, endColor) => {
    return `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`;
  };

  const stats = [
    {
      title: 'Total Projects',
      value: calProjects.totalProjects,
      subtext: `${calProjects.projectsCreatedLastMonth} projects activity this month`,
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      icon1: <AssignmentIcon sx={{ fontSize: 17 }} />,
      gradient: getGradientColor('#6A11CB', '#2575FC'),
      iconBg: alpha('#6A11CB', 0.2)
    },
    {
      title: 'Total Members',
      value: calMembers.totalInactiveNonAdminMembers,
      subtext: `${calMembers.totalMembersJoinedLastMonth} joined activity this month`,
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      icon1: <GroupIcon sx={{ fontSize: 17 }} />,
      gradient: getGradientColor('#FF416C', '#FF4B2B'),
      iconBg: alpha('#FF416C', 0.2)
    },
    {
      title: 'Total Tasks',
      value: calProjects.totalTasks,
      subtext: `${calProjects.tasksCreatedLastMonth} tasks activity this month`,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      icon1: <CheckCircleIcon sx={{ fontSize: 17 }} />,
      gradient: getGradientColor('#11998e', '#38ef7d'),
      iconBg: alpha('#11998e', 0.2)
    },
    {
      title: 'Total Lists',
      value: calProjects.totalLists,
      subtext: `${calProjects.listsCreatedLastMonth} lists activity this month`,
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      icon1: <TimelineIcon sx={{ fontSize: 17 }} />,
      gradient: getGradientColor('#FC466B', '#3F5EFB'),
      iconBg: alpha('#FC466B', 0.2)
    }
  ];

  return (
    <StyledGrid 
      container 
      spacing={3}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 2,
          boxShadow: theme.shadows[4],
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: (props) => props.gradient,
          }
        }
      }}
    >
      {stats.map((stat, index) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={3} 
          key={index}
          sx={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(20px)'
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            }
          }}
        >
          <StatsCard {...stat} />
        </Grid>
      ))}
    </StyledGrid>
  );
};

export default StatsGrid;
