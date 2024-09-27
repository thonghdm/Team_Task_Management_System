import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  InputBase,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import NotificationPanel from '../NotificationPanel';
import UserAvatar from '../UserAvatar';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#FFFF00', // Yellow background
  color: '#000000', // Black text
}));

const Header = ({ toggleDrawer }) => {
  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          DTPROJECT
        </Typography>
        <IconButton color="inherit" sx={{ marginTop: 1 }}>
          <NotificationPanel />
        </IconButton>
        <UserAvatar />
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;