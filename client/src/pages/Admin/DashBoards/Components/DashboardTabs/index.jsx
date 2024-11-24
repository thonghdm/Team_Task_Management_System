import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';

const DashboardTabs = ({ value, onChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      {/* <Tabs value={value} onChange={onChange}>
        <Tab icon={<DashboardIcon />} label="Overview" value="overview" />
        <Tab icon={<AssignmentIcon />} label="Projects" value="projects" />
        <Tab icon={<GroupIcon />} label="Team" value="team" />
        <Tab icon={<AssessmentIcon />} label="Reports" value="reports" />
      </Tabs> */}
      <Tabs value={value} onChange={onChange}>
        <Tab label="Overview" value="overview" />
        <Tab label="Projects" value="projects" />
        <Tab label="Team" value="team" />
        <Tab label="Reports" value="reports" />
      </Tabs>
    </Box>
  );
};

export default DashboardTabs;