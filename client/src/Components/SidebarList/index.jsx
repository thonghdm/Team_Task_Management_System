import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const SidebarList = ({ linkData, isProject = false, Id }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[2] || ''; // Handle cases where there might not be a third segment
  const theme = useTheme();

  return (
    <List disablePadding>
      {linkData?.map((item) => (
        <ListItem key={item?.projectName} disablePadding>
          <ListItemButton
            component={Link}
            to={`/board/${item?._id}/${Id}`}
            sx={{
              backgroundColor: path === item?._id ? theme.palette.action.selected : 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.action.hoverOpacity, // Hover effect
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
                    backgroundColor: item?.color || theme.palette.primary.main,
                  }}
                />
              ) : (
                item.icon
              )}
            </ListItemIcon>
            <ListItemText
              primary={item?.projectName}
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