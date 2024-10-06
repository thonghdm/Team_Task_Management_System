import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SidebarList = ({ linkData, isProject = false,color }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const theme = useTheme();

  return (
    <List disablePadding>
      {linkData.map((item) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton
            component={Link}
            to={item.link}
            selected={path === item.link}
            sx={{
              backgroundColor: path === item.link ? 'rgba(255, 255, 255, 0.08)' : 'inherit',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
              {isProject ? (
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 1,
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                sx: { 
                  fontSize: 'inherit',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default SidebarList;