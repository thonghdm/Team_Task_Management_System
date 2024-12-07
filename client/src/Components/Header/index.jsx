import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import NotificationPanel from '../NotificationPanel';
import UserAvatar from '../UserAvatar';
import SearchWithFilters from '../Search';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.background.default, // Changed from .paper to .default
}));

const Header = ({ toggleDrawer }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getSearchWidth = () => {
    return 'calc(100% - 500px)';
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          minWidth: isSmallScreen ? '100px' : '200px',
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ 
            marginLeft: '8px',
            display: isSmallScreen ? 'none' : 'block', 
          }}>
            DTPROJECT
          </Typography>
        </div>

        <div style={{ 
          flexGrow: 1,
          display: 'flex', 
          justifyContent: 'center',
          margin: '0 16px',
        }}>
          {/* <SearchWithFilters width={getSearchWidth()} /> */}
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: isSmallScreen ? '80px' : '100px',
        }}>
          <IconButton color="inherit" sx={{ marginRight: 4 }}>
            {/* <NotificationPanel /> */}
          </IconButton>
          <UserAvatar />
        </div>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
