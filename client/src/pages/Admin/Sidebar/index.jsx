import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  AssignmentTurnedIn as TaskIcon,
  Inbox as InboxIcon,
  PeopleAlt as PeopleAltIcon,
  Dashboard as DashboardIcon,
  MonitorHeart as MonitorHeartIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import SidebarList from '~/Components/SidebarList';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


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

const mainLinkData1 = [
  { projectName: 'Users', _id: 'users', icon: <PeopleAltIcon />,  main: 'Users'},
  { projectName: 'Projects', _id: 'projects', icon: <MonitorHeartIcon />,  main: 'Projects'},
  { projectName: 'Dashboard', _id: 'dashboards', icon: <DashboardIcon />,  main: 'Dashboard'},
  { projectName: 'ChangePassword', _id: 'change-password', icon: <LockIcon />,  main: 'Dashboard'},
];



const Sidebar = ({ open }) => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  


  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 64px)', // Subtract Toolbar height
          overflow: 'hidden',
          mt:1
        }}
      >
        <Box sx={{ fontSize: '17px' }}>
          <SidebarList linkData={mainLinkData1} Id = {101} URL="admin"/>
        </Box>

      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;