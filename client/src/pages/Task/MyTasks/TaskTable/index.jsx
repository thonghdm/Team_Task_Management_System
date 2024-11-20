import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Chip, Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useTheme } from '@mui/material/styles';

const defaultAvatar = 'https://i.pravatar.cc/300'
import {formatDateRange} from '~/utils/formatDateRange'

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
        {tasks?.filter(task => task.task_id !== null)?.map((task) => (
          <TableRow
            key={task?.task_id?._id}
            onClick={() => onRowClick(task?.task_id?._id)}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: theme.palette.action.hover },
              position: 'relative',
              cursor: 'pointer'
            }}
          >
            <TableCell>
              {/* <Typography variant="body2">{task.task_name}</Typography> */}
              <Box sx={{ maxWidth: "500px", overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {task?.task_id?.task_name?.length > 60 ? `${task?.task_id?.task_name?.slice(0, 60)}...` : task?.task_id?.task_name}
              </Box>
            </TableCell>
            <TableCell >{formatDateRange(task?.task_id?.start_date,task?.task_id?.end_date)}</TableCell>
            <TableCell align="right">
              {task?.task_id?.assigned_to_id?.length > 0 ? (
                <AvatarGroup max={3} sx={{
                  '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 15 },
                }}>
                  {task?.task_id?.assigned_to_id?.map((assigned, index) => (
                    <Avatar
                      key={index}
                      alt={assigned?.memberId?.displayName}
                      src={assigned?.memberId?.image}
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
              {task?.task_id?.project_id?.projectName && (
                <Chip label={task?.task_id?.project_id?.projectName?.length > 30 ? `${task?.task_id?.project_id?.projectName?.slice(0, 30)}...` : task?.task_id?.project_id?.projectName} size="small" />
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
                  backgroundColor: task?.task_id?.status === 'Completed'
                    ? 'green'
                    : task?.task_id?.status === 'To Do'
                      ? 'red'
                      : 'yellow'
                }}
              />
              <Typography variant="body2">{task?.task_id?.status}</Typography>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TaskTable;
