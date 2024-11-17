import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SidebarListStarred = ({ linkData, isProject = false }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || ''; // Handle cases where there might not be a third segment
  const theme = useTheme();

  return (
    <List disablePadding>
      {(Array.isArray(linkData) ? linkData : []).map((item) => (
        <ListItem key={item?.projectId?.projectName} disablePadding>
          <ListItemButton
            component={Link}
            to={`/board/${item?.projectId?._id}`}
            selected={path === item?.projectId?._id}
            sx={{
              backgroundColor: path === item?.projectId?._id ? 'rgba(255, 255, 255, 0.08)' : 'inherit',
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
                    backgroundColor: "#cd9d00",
                  }}
                />
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText 
              primary={item?.projectId?.projectName}
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

export default SidebarListStarred;