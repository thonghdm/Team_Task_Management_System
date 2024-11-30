// src/pages/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import DashboardTabs from '~/pages/Admin/DashBoards/Components/DashboardTabs';
import StatsGrid from '~/pages/Admin/DashBoards/Overview/StatsGrid';
// import ProjectTimeline from '~/pages/Admin/DashBoards/Overview/ProjectTimeline';
import RecentProjects from '~/pages/Admin/DashBoards/Overview/RecentProjects';
import MemberStatistics from '~/pages/Admin/DashBoards/Overview/MemberStatistics';

import ProjectDashboard from './ProjectDashboard';

import { fetchProjectsThunk } from '~/redux/project/project-slice/index';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { fetchAllMembers } from '~/redux/member/member-slice/index';

import { calculateProjectStats, calculateMemberStats, normalizeData, dataBigProject } from '~/utils/OverviewDashAdmin'

const DashBoards = () => {
  const [currentTab, setCurrentTab] = useState('overview');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const { project } = useSelector((state) => state.projectThunk);
  const { memberData } = useSelector((state) => state.allMember);

  // const dispatch = useDispatch();
  // const { accesstoken } = useSelector(state => state.auth)

  // const refreshToken = useRefreshToken();
  // useEffect(() => {
  //   const getAllProjects = async (token) => {
  //     try {
  //       await dispatch(fetchProjectsThunk({ accesstoken: token })).unwrap();
  //     } catch (error) {
  //       if (error?.err === 2) {
  //         const newToken = await refreshToken();
  //         return getAllProjects(newToken);
  //       }
  //       toast.error(error.response?.data.message || 'Unable to load project information!');
  //     }
  //   };

  //   getAllProjects(accesstoken);

  // }, [dispatch, accesstoken]);

  // console.log(project?.projects);

  // useEffect(() => {
  //   const getAllMembers = async (token) => {
  //     try {
  //       await dispatch(fetchAllMembers({ accesstoken: token })).unwrap();
  //     } catch (error) {
  //       if (error?.err === 2) {
  //         const newToken = await refreshToken();
  //         return getAllMembers(newToken);
  //       }
  //       toast.error(error.response?.data.message || 'Unable to load project information!');
  //     }
  //   };

  //   getAllMembers(accesstoken);

  // }, [dispatch, accesstoken]);

  const calProjects = calculateProjectStats(project);
  const calMembers = calculateMemberStats(memberData);
  const statisticsMember = normalizeData(memberData?.users);
  const dataBigProjects = dataBigProject(project);
  // console.log(statisticsMember);

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: "70px  " }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Project Management Dashboard
        </Typography>
        <DashboardTabs value={currentTab} onChange={handleTabChange} />
      </Box>

      {currentTab === 'overview' && (
        <Box>
          <StatsGrid calProjects={calProjects} calMembers={calMembers} />
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              {/* <ProjectTimeline /> */}
              <MemberStatistics statisticsMember={statisticsMember} />
            </Grid>
            <Grid item xs={12} md={4}>
              <RecentProjects dataBigProjects={dataBigProjects} />
            </Grid>
          </Grid>
        </Box>
      )}

      {currentTab === 'projects' && (
        <ProjectDashboard />
      )}

      {currentTab === 'team' && (
        <Typography variant="h6">Team</Typography>
      )}

      {currentTab === 'reports' && (
        <Typography variant="h6">Reports</Typography>
      )}
    </Container>
  );
};

export default DashBoards;