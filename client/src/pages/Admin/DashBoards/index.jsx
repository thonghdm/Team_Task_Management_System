// src/pages/Dashboard/index.jsx
import React, { useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import DashboardTabs from '~/pages/Admin/DashBoards/Components/DashboardTabs';
import StatsGrid from '~/pages/Admin/DashBoards/Overview/StatsGrid';
import ProjectTimeline from '~/pages/Admin/DashBoards/Overview/ProjectTimeline';
import RecentProjects from '~/pages/Admin/DashBoards/Overview/RecentProjects';
import MemberStatistics from '~/pages/Admin/DashBoards/Overview/MemberStatistics';
const DashBoards = () => {
  const [currentTab, setCurrentTab] = useState('overview');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt:"70px  " }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Project Management Dashboard
        </Typography>
        <DashboardTabs value={currentTab} onChange={handleTabChange} />
      </Box>

      {currentTab === 'overview' && (
        <Box>
          <StatsGrid />
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={8}>
              {/* <ProjectTimeline /> */}
              <MemberStatistics />
            </Grid>
            <Grid item xs={12} md={4}>
              <RecentProjects />
            </Grid>
          </Grid>
        </Box>
      )}

      {currentTab === 'projects' && (
        <Typography variant="h6">Projects</Typography>
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