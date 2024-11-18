import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useTheme } from '@mui/material/styles';

const defaultAvatar = 'https://i.pravatar.cc/300'

const TaskTable = ({ tasks, onRowClick }) => {
  const theme = useTheme();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold' }}>Task name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Due date</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} align="right">Collaborators</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Projects</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }} >Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow
            key={task.id}
            onClick={() => onRowClick(task.id)}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: theme.palette.action.hover },
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <TableCell>
              {/* <Typography variant="body2">{task.name}</Typography> */}
              <Box sx={{ maxWidth: "500px", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {task.name.length > 60 ? `${task.name.slice(0, 60)}...` : task.name}
              </Box>
            </TableCell>
            <TableCell >{task.dueDate}</TableCell>
            <TableCell align="right">
              {task.collaborators.length > 0 ? (
                <AvatarGroup max={3} sx={{
                  '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 15 },
                }}>
                  {task.collaborators.map((collaborator, index) => (
                    <Avatar
                      key={index}
                      alt={collaborator.name}
                      src={collaborator.avatar}
                      onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar || ""; }} // Fallback to default image
                    />
                  ))}
                </AvatarGroup>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No collaborators
                </Typography>
              )}
            </TableCell>
            <TableCell >
              {task.project && (
                <Chip label={task.project.length > 30 ? `${task.project.slice(0, 30)}...` : task.project} size="small" />
              )}
            </TableCell>
            <TableCell sx={{ display: 'flex' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  mt: '5px',
                  marginRight: 1,
                  backgroundColor: task.status === 'Completed'
                    ? 'green'
                    : task.status === 'To Do'
                      ? 'red'
                      : 'yellow'
                }}
              />
              <Typography variant="body2">{task.status}</Typography>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
