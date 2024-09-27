import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const SidebarList = ({ linkData, open }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];

  return (
    <List>
      {linkData.map((item) => (
        <ListItem key={item.label} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={Link}
            to={item.link}
            selected={path === item.link}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              backgroundColor: path === item.link ? '#58d68d !important' : 'inherit',
              '&:hover': {
                backgroundColor: path === item.link ? '#58d68d !important' : 'red',
              },
              borderRadius: 24,
              margin: '8px',
            }}
          >
            <Tooltip title={item.label} placement="right" arrow>
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            <ListItemText primary={item.label} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarList;
