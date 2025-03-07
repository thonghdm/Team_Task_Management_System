import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import moment from 'moment';
import useSocket from '~/utils/useSocket';

const ICONS = {
  alert: <NotificationsActiveIcon />,
  message: <MessageIcon />,
  task_invite: <NotificationsActiveIcon />
};

const NotificationPanel = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const { accesstoken, userData } = useSelector(state => state.auth);
  
  // Initialize socket hook with user ID and access token
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications,
    loading 
  } = useSocket(userData?._id, accesstoken);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Refresh notifications when opening the menu
    refreshNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const isNotificationRead = (notification) => {
    if (typeof notification.isRead === 'boolean') {
      return notification.isRead;
    }
    
    if (Array.isArray(notification.isRead)) {
      return notification.isRead.includes(userData?._id);
    }
    
    return false;
  };

  const viewHandler = (notification) => {
    handleMarkAsRead(notification._id);
    
    const { task, notiType } = notification;
    
    if (task && task._id) {
      // Navigate to the task
      // window.location.href = `/tasks/${task._id}`;
      console.log(`Navigating to task ${task._id}: ${task.title}`);
    }
    
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-controls={open ? 'notification-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Popover
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 360,
            maxWidth: '100%',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {unreadCount > 0 && (
            <Typography 
              variant="body2" 
              color="primary" 
              sx={{ cursor: 'pointer' }}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Typography>
          )}
        </Box>
        <Divider />
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2">No notifications</Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto', padding: 0 }}>
            {notifications.map((notification) => (
              <ListItem 
                key={notification._id} 
                button
                onClick={() => viewHandler(notification)}
                sx={{
                  backgroundColor: isNotificationRead(notification) ? 'inherit' : 'rgba(25, 118, 210, 0.08)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                  borderBottom: `1px solid ${theme.palette.divider}`
                }}
              >
                <ListItemIcon>
                  {ICONS[notification.notiType] || <NotificationsIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">
                        {notification.task?.title || notification.notiType || 'Notification'}
                      </Typography>
                      <Typography variant="caption">
                        {notification.createdAt ? moment(notification.createdAt).fromNow() : ''}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: theme.palette.text.secondary,
                        fontWeight: isNotificationRead(notification) ? 'normal' : 'medium',
                      }}
                    >
                      {notification.text || notification.message}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
        
        <Divider />
        <Box display="flex">
          <Button
            fullWidth
            onClick={handleClose}
            sx={{
              py: 1,
              borderRight: 1,
              borderColor: 'divider'
            }}
          >
            Close
          </Button>
          <Button
            fullWidth
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            sx={{ py: 1 }}
          >
            Mark All Read
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel; 