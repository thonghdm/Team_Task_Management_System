import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  AssignmentTurnedIn as TaskIcon,
  Inbox as InboxIcon,
  BarChart as ReportingIcon,
  Folder as PortfoliosIcon,
  Flag as GoalsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import SidebarList from '../SidebarList';
import { useTheme } from '@mui/material/styles';



const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  textTransform: 'uppercase',
  color: '#888',
  fontWeight: 'bold',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));
const TrialInfo = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 5,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

const ScrollableSection = styled(Box)(({ theme }) => ({
  maxHeight: '52vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '3px',
  },
  fontSize: '14px',
}));
const AddBillingButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#000',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
  },
}));
const mainLinkData = [
  { label: 'Home', link: 'home', icon: <HomeIcon /> },
  { label: 'My tasks', link: 'tasks', icon: <TaskIcon /> },
  { label: 'Inbox', link: 'inbox', icon: <InboxIcon /> },
];

const insightsLinkData = [
  { label: 'Reporting', link: 'reporting', icon: <ReportingIcon /> },
  { label: 'Portfolios', link: 'portfolios', icon: <PortfoliosIcon /> },
  { label: 'Goals', link: 'goals', icon: <GoalsIcon /> },
];

const projectsLinkData = [
  { label: 'Cross-functional project p...', link: 'project1' },
  { label: 'My first portfolio', link: 'project2'},
  { label: 'uijjj', link: 'project3'},
  // Add more projects here to test scrolling
];


const teamLinkData = [
  { label: 'Team', link: 'team', icon: <ReportingIcon /> },

];

const Sidebar = ({ open }) => {
  const location = useLocation();
  const theme = useTheme();
  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 64px)', // Subtract Toolbar height
          overflow: 'hidden',
        }}
      >
        <Box sx={{ fontSize: '14px' }}>
          <SidebarList linkData={mainLinkData} />
        </Box>


        <ScrollableSection>
          {/* <Box>
            <SectionTitle>INSIGHTS</SectionTitle>
            <SidebarList linkData={insightsLinkData} open={open} />
          </Box> */}

          <Box>
            <SectionTitle>PROJECTS</SectionTitle>
            <SidebarList linkData={projectsLinkData} isProject={true} open={open}/>
          </Box>

          <Box>
            <SectionTitle>TEAM</SectionTitle>
            <SidebarList linkData={teamLinkData} open={open} />
          </Box>
        </ScrollableSection>


        <Box sx={{ marginTop: 'auto' }}>
          <TrialInfo>
            <Box display="flex" alignItems="center" mb={1}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  marginRight: 1,
                }}
              />
              <Typography>Advanced free trial</Typography>
            </Box>
            <Typography variant="body2" mb={1}>30 days left</Typography>
            <AddBillingButton fullWidth variant="contained">
              Add billing info
            </AddBillingButton>
          </TrialInfo>
          <Box textAlign="center" mb={2}>
            <Typography
              sx={{
                color: (theme) => theme.palette.success.main, 
                cursor: 'pointer',
              }}
            >              
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;