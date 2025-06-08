import React, { useCallback, useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';


import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';

import StatsCard from '~/pages/Admin/DashBoards/Components/StatsCard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';

import { useTheme } from '@mui/material';
import TaskProgressChart from './TaskProgressChart';
import ProjectAnalyticsDashboard from './ProjectAnalyticsDashboard';

import { transformDataTaskDetails, getParticipantTrend, getPriorityDistribution, getStats } from '~/utils/transformDataProjectDash';
import { styled } from '@mui/material/styles';

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
}));


function DashBoard() {
  const theme = useTheme();
  const { accesstoken } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const { projectData } = useSelector((state) => state.projectDetail);
  const { projectId } = useParams();


  const refreshToken = useRefreshToken();
  useEffect(() => {
    const getProjectDetail = async (token) => {
      try {
        await dispatch(fetchProjectDetail({ accesstoken: token, projectId })).unwrap();
      } catch (error) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return getProjectDetail(newToken);
        }
        toast.error(error.response?.data.message || 'Unable to load project information!');
      }
    };

    getProjectDetail(accesstoken);

    return () => {
      dispatch(resetProjectDetail());
    };
  }, [dispatch, projectId, accesstoken]);

  const icons = [<AssignmentIcon />, <GroupIcon />, <CheckCircleIcon />, <TimelineIcon />];

  const dataTaskDetails = transformDataTaskDetails(projectData?.project?.lists);
  const dataParticipantTrend = getParticipantTrend(projectData?.project?.lists);
  const dataPriorityDistribution = getPriorityDistribution(projectData?.project?.lists);
  const stats = getStats(projectData?.project?.lists);

  const statsWithIcons = stats.map((stat, index) => ({
    ...stat,
    icon: icons[index],
    icon1: React.cloneElement(icons[index], { sx: { fontSize: 17 } })
  }));

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
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
          {/* Thống Kê */}
          {statsWithIcons.map((stat, index) => (
            <Grid item 
            xs={12} 
            sm={5} 
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
            }}>
              <StatsCard {...stat} />
            </Grid>
          ))}

          {/* Biểu Đồ */}


          <ProjectAnalyticsDashboard dataPriorityDistribution={dataPriorityDistribution} dataParticipantTrend={dataParticipantTrend}/>
          <Grid item xs={12} md={12}>
            <TaskProgressChart dataTaskDetails={dataTaskDetails}/>
          </Grid>
        </StyledGrid>
      </Box>
    </>
  );
}

export default DashBoard;