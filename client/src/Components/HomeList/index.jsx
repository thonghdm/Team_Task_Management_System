import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {formatDateRange} from '~/utils/formatDateRange'

const HomeList = ({ upcoming, overdue, completed, onRowClick}) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  // Get the tasks for the selected tab
  const selectedTasks =
    value === 0 ? upcoming : value === 1 ? overdue : completed;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      <Tabs
        value={value}
        onChange={handleChange}
        sx={{ mb: 2 }}
      // variant="fullWidth"
      >
        <Tab label="Upcoming" />
        <Tab label="Overdue" />
        <Tab label="Completed" />
      </Tabs>

      <TableContainer className="scrollable" component={Paper} sx={{ maxHeight: 340 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Task Name</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedTasks?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No tasks found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              selectedTasks?.map((task, index) => (
                <TableRow
                  key={task?.task_id?._id || index}
                  hover
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': { backgroundColor: theme.palette.action.hover },
                    border: `1px solid ${theme.palette.text.secondary}`,
                  }}
                  onClick={() => onRowClick(task?.task_id?._id)}
                >
                  <TableCell>
                    <Box>
                      {task?.task_id?.task_name?.length > 100 ? `${task?.task_id?.task_name?.slice(0, 100)}...` : task?.task_id?.task_name}
                    </Box>
                  </TableCell>
                  <TableCell sx={{display: 'flex'}}>
                  <Box
                      sx={{
                        width: 10,
                        height: 10,
                        mt: '4px',
                        marginRight: 1,
                        backgroundColor: task?.task_id?.priority === 'Low'
                          ? '#4CD2C0'
                          : task?.task_id?.status === 'High'
                            ? '#E587FF'
                            : '#FFB84D'
                      }}
                    />
                    {task?.task_id?.priority || 'N/A'}

                  </TableCell>
                  <TableCell>
                    {formatDateRange(task?.task_id?.start_date, task?.task_id?.end_date)}
                  </TableCell>
                  <TableCell sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        mt: '4px',
                        borderRadius: '50%',
                        marginRight: 1,
                        backgroundColor: task?.task_id?.status === 'Completed'
                          ? 'green'
                          : task?.task_id?.status === 'To Do'
                            ? 'red'
                            : 'yellow'
                      }}
                    />
                    {task?.task_id?.status || 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HomeList;