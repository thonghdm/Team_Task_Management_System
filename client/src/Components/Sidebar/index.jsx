import React from 'react';
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

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open  }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#2d2d2d',
    color: '#FFFFFF',
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
  backgroundColor: '#f1ada6',
  color: '#FFFFFF',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(1),
  backgroundColor: '#f1ada6',
  color: '#FFFFFF',
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
  backgroundColor: '#3d3d3d',
  borderRadius: 5,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
}));

const ScrollableSection = styled(Box)(({ theme }) => ({
  maxHeight: '43vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '3px',
  },
  fontSize: '14px',
}));
const AddBillingButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffc107',
  color: '#000',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#ffca28',
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
  { label: 'Cross-functional project p...', link: 'project1', color: '#00BCD4' },
  { label: 'My first portfolio', link: 'project2', color: '#9E9E9E' },
  { label: 'uijjj', link: 'project3', color: '#2196F3' },
  // Add more projects here to test scrolling
];


const teamLinkData = [
  { label: 'Team', link: 'team', icon: <ReportingIcon /> },

];

const Sidebar = ({open}) => {
  const location = useLocation();

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
          <Box>
          <SectionTitle>INSIGHTS</SectionTitle>
          <SidebarList linkData={insightsLinkData} open={open}/>
          </Box>

          <Box>
          <SectionTitle>PROJECTS</SectionTitle>
          <SidebarList linkData={projectsLinkData} isProject={true}open={open}/>
          </Box>

          <Box>
          <SectionTitle>TEAM</SectionTitle>
          <SidebarList linkData={teamLinkData}open={open} />
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
                  backgroundColor: '#4CAF50',
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
            <Typography color="#4CAF50" sx={{ cursor: 'pointer' }}>
              <AddIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
              Invite teammates
            </Typography>
          </Box>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;