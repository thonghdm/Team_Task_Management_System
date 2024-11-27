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

// const stats = [
//   {
//     title: 'Total Lists',
//     value: '24',
//     subtext: '4 lists created this month',
//     icon: <AssignmentIcon />,
//     color: '#2196f3'
//   },
//   {
//     title: 'Total Attachments',
//     value: '12',
//     subtext: '3 upload this month',
//     icon: <GroupIcon />,
//     color: '#4caf50'
//   },
//   {
//     title: 'Total Tasks',
//     value: '156',
//     subtext: '3 tasks created this month',
//     icon: <CheckCircleIcon />,
//     color: '#ff9800'
//   },
//   {
//     title: 'Total Labels',
//     value: '8',
//     subtext: '3 Labels created this month',
//     icon: <TimelineIcon />,
//     color: '#f44336'
//   }
// ];

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

  // console.log(projectData?.project?.lists);
  const icons = [<AssignmentIcon />, <GroupIcon />, <CheckCircleIcon />, <TimelineIcon />];

  const dataTaskDetails = transformDataTaskDetails(projectData?.project?.lists);
  const dataParticipantTrend = getParticipantTrend(projectData?.project?.lists);
  const dataPriorityDistribution = getPriorityDistribution(projectData?.project?.lists);
  const stats = getStats(projectData?.project?.lists);

  const statsWithIcons = stats.map((stat, index) => ({
    ...stat,
    icon: icons[index]
}));

  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={3}>
          {/* Thống Kê */}
          {statsWithIcons.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard
                title={stat.title}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
                color={stat.color}
                background={theme.palette.background.paper}
              />
            </Grid>
          ))}

          {/* Biểu Đồ */}


          <ProjectAnalyticsDashboard dataPriorityDistribution={dataPriorityDistribution} dataParticipantTrend={dataParticipantTrend}/>
          <Grid item xs={12} md={12}>
            <TaskProgressChart dataTaskDetails={dataTaskDetails}/>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default DashBoard;