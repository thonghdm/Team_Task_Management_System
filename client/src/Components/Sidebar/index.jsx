import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  Button,
  IconButton
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
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjectsByMemberId } from '~/redux/project/project-slice';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';

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
  { projectName: 'Home', _id: 'home', icon: <HomeIcon /> },
  { projectName: 'My tasks', _id: 'tasks', icon: <TaskIcon /> },
  { projectName: 'Inbox', _id: 'inbox', icon: <InboxIcon /> },
];


const projectsLinkData = [
  { label: 'Cross-functional project p...', _id: 'project1' },
  { label: 'My first portfolio', _id: 'project2' },
  { label: 'uijjj', _id: 'project3' },
  // Add more projects here to test scrolling
];


const teamLinkData = [
  { projectName: 'Team', _id: 'team', icon: <ReportingIcon /> },
];

const Sidebar = ({ open }) => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accesstoken, userData, isLoggedIn } = useSelector(state => state.auth)
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    if (accesstoken && userData) {
      console.log('Dispatching with userData._id:', userData._id);
      dispatch(fetchProjectsByMemberId({ accesstoken, memberId: userData._id }));
    }
  }, [dispatch, accesstoken, userData, isLoggedIn]);

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
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <SectionTitle>PROJECTS</SectionTitle>
              <IconButton onClick={() => { navigate('/projects-new'), { state: { from: location.pathname } } }}>
                <AddIcon sx={{ width: 17, mt: "3px" }} />
              </IconButton>
            </Box>
            {projects?.projects&&<SidebarList linkData={projects?.projects} isProject={true} open={open} />
            }
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