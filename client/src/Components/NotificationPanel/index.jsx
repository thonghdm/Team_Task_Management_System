import React, { useState } from 'react';
import { 
  Popover, 
  IconButton, 
  Badge, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Button
} from '@mui/material';
import { 
    Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import moment from 'moment';

const data = [
    {
      _id: "65c5bbf3787832cf99f28e6d",
      team: [
        "65c202d4aa62f32ffd1303cc",
        "65c27a0e18c0a1b750ad5cad",
        "65c30b96e639681a13def0b5",
      ],
      text: "New task has been assigned to you and 2 others. The task priority is set a normal priority, so check and act accordingly. The task date is Thu Feb 29 2024. Thank you!!!",
      task: null,
      notiType: "alert",
      isRead: [],
      createdAt: "2024-02-09T05:45:23.353Z",
      updatedAt: "2024-02-09T05:45:23.353Z",
      __v: 0,
    },
    {
      _id: "65c5f12ab5204a81bde866ab",
      team: [
        "65c202d4aa62f32ffd1303cc",
        "65c30b96e639681a13def0b5",
        "65c317360fd860f958baa08e",
      ],
      text: "New task has been assigned to you and 2 others. The task priority is set a high priority, so check and act accordingly. The task date is Fri Feb 09 2024. Thank you!!!",
      task: {
        _id: "65c5f12ab5204a81bde866a9",
        title: "Test task",
      },
      notiType: "alert",
      isRead: [],
      createdAt: "2024-02-09T09:32:26.810Z",
      updatedAt: "2024-02-09T09:32:26.810Z",
      __v: 0,
    },
  ];

const ICONS = {
  alert: <NotificationsActiveIcon />,
  message: <MessageIcon />,
};

const NotificationPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const readHandler = () => {
    // Implement read handler
  };

  const viewHandler = (item) => {
    // Implement view handler
  };

  const callsToAction = [
    { name: "Cancel", onClick: handleClose },
    { name: "Mark All Read", onClick: () => readHandler("all", "") },
  ];

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={data.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, maxWidth: '100%' }}>
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {data.slice(0, 5).map((item, index) => (
              <ListItem 
                key={item._id + index} 
                button 
                onClick={() => viewHandler(item)}
                sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <ListItemIcon>
                  {ICONS[item.notiType]}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="subtitle2">{item.notiType}</Typography>
                      <Typography variant="caption">{moment(item.createdAt).fromNow()}</Typography>
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {item.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box display="flex">
            {callsToAction.map((action, index) => (
              <Button
                key={action.name}
                fullWidth
                onClick={action.onClick}
                sx={{ 
                  py: 1, 
                  borderRight: index === 0 ? 1 : 0, 
                  borderColor: 'divider'
                }}
              >
                {action.name}
              </Button>
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;