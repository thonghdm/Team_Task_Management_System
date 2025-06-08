import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
import NotificationPanel from '../NotificationPanel';
import UserAvatar from '../UserAvatar';
import { GradientTypography } from '~/shared/styles/commonStyles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(18, 18, 18, 0.95)'
    : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(0, 0, 0, 0.1)'}`,
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: theme.breakpoints.down('sm') ? '100px' : '200px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.05)',
  },
}));

const ActionContainer = styled(Stack)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: theme.breakpoints.down('sm') ? '80px' : '100px',
  gap: theme.spacing(2),
}));

const NotificationButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.05)',
  },
}));

const Header = ({ toggleDrawer }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledAppBar position="fixed">
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'nowrap',
          minHeight: '64px',
          padding: theme.spacing(0, 2),
        }}
      >
        <LogoContainer>
          <MenuButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            size="large"
          >
            <MenuIcon />
          </MenuButton>
          {!isSmallScreen && (
            <GradientTypography
              variant="h6"
              noWrap
              component="div"
              sx={{
                marginLeft: '8px',
                fontWeight: 600,
                letterSpacing: '0.5px',
              }}
            >
              DTPROJECT
            </GradientTypography>
          )}
        </LogoContainer>

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            margin: '0 16px',
          }}
        >
          {/* Search component can be added here */}
        </Box>

        <ActionContainer direction="row">
          <NotificationButton
            color="inherit"
            size="large"
            aria-label="notifications"
          >
            <NotificationPanel />
          </NotificationButton>
          <UserAvatar />
        </ActionContainer>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
