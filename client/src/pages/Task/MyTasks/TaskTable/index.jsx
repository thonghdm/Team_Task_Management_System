import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

const TaskTable = ({ tasks }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Task name</TableCell>
          <TableCell align="right">Due date</TableCell>
          <TableCell align="right">Collaborators</TableCell>
          <TableCell align="right">Projects</TableCell>
          <TableCell align="right">Task visibility</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell>
              <Typography variant="body2">{task.name}</Typography>
            </TableCell>
            <TableCell align="right">{task.dueDate}</TableCell>
            <TableCell align="right">
              {task.collaborators.length > 0 ? (
                <AvatarGroup max={3}>
                  {task.collaborators.map((collaborator, index) => (
                    <Avatar 
                      key={index} 
                      alt={collaborator.name} 
                      src={collaborator.avatar} 
                      onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }} // Fallback to default image
                    />
                  ))}
                </AvatarGroup>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No collaborators
                </Typography>
              )}
            </TableCell>
            <TableCell align="right">
              {task.project && (
                <Chip label={task.project} size="small" />
              )}
            </TableCell>
            <TableCell align="right">{task.visibility}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
