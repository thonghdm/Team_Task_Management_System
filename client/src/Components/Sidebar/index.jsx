import React from 'react';
import {
  Box,
  Drawer,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Task as TaskIcon,
  Pending as PendingIcon,
  People as PeopleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import SidebarList from '../SidebarList';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
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
  width: theme.spacing(7),
  backgroundColor: '#f1ada6',
  color: '#FFFFFF',
});

const linkData = [
  { label: 'Dashboard', link: 'dashboard', icon: <DashboardIcon /> },
  { label: 'Tasks', link: 'tasks', icon: <TaskIcon /> },
  { label: 'To Do', link: 'todo', icon: <PendingIcon /> },
  { label: 'Team', link: 'team', icon: <PeopleIcon /> },
  { label: 'Trash', link: 'trashed', icon: <DeleteIcon /> },
];

const linkDataSetting = [
  { label: 'Account', link: 'account', icon: <DashboardIcon /> },
  { label: 'Setting', link: 'setting', icon: <TaskIcon /> },
];

const Sidebar = ({ open }) => {
  const location = useLocation();

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'auto',
          overflowX: 'hidden'
        }}
      >
        <Box flex={1}>
          <SidebarList linkData={linkData} open={open} />
        </Box>
        
        <Box sx={{ mt: 'auto', mb: 2 }}>
          <SidebarList linkData={linkDataSetting} open={open} />
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;