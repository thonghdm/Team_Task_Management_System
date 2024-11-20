import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import TaskTable from '~/pages/Task/MyTasks/TaskTable';


import { apiRefreshToken } from '~/apis/Auth/authService';
import { useDispatch, useSelector } from 'react-redux'

import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'

import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'
const TaskList = () => {
  const theme = useTheme();


  const dispatch = useDispatch()
  const { accesstoken, userData } = useSelector(state => state.auth)

  const {success} = useSelector(state => state.taskInviteUser)
  
  useEffect(() => {
    dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
  }, [dispatch, userData?._id, accesstoken]);

  console.log('success', success)


  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  // Sample task data
  const normalizeTasks = (tasks) => {
    return tasks.map(task => ({
      ...task,
      collaborators: Array.isArray(task.collaborators)
        ? task.collaborators
        : task.collaborators ? [task.collaborators] : []
    }));
  };

  const tasks = normalizeTasks([
    {
      id: 1,
      name: 'Schedule kickoff meetingSchedule kickoff meetingSchedule kickoff meeting',
      dueDate: '2024-10-15',
      collaborators: [
        { name: 'John Doe', avatar: 'https://www.pngitem.com/middle/TbRixR_img-hd-png/' },
        { name: 'Jane Smith', avatar: '/static/images/avatar/2.jpg' }
      ],
      project: 'Cross-functional project',
      status: 'Completed'
    },
    {
      id: 2,
      name: 'Prepare project timeline',
      dueDate: '2024-10-20',
      collaborators: [
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' }, // Example of valid URL
        // Repeat this as necessary, or modify to use distinct users.
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
        { name: 'Alice Johnson', avatar: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
      ],
      project: 'Marketing strategy',
      status: 'To Do'
    },
    {
      id: 3,
      name: 'Client meeting',
      dueDate: '2024-10-22',
      collaborators: [],
      project: 'Product development',
      status: 'To Do'
    },
    {
      id: 4,
      name: 'Review design specs',
      dueDate: '2024-10-30',
      collaborators: [{ name: 'Cindy Baker', avatar: '/static/images/avatar/4.jpg' }],
      project: 'UI/UX Revamp',
      status: 'To Do'
    },
    {
      id: 5,
      name: 'Fix bugs in application',
      dueDate: '2024-10-08',
      collaborators: [{ name: 'Michael Brown', avatar: '/static/images/avatar/5.jpg' }],
      project: 'App development',
      status: 'Completed'
    }
  ]);



  const handleRowOverdueClick = (taskId) => {
    console.log('Task clicked:', taskId);
    // Xử lý logic khi click vào task ở đây
  };

  // Task Filtering
  const todayTasks = tasks?.filter(task => new Date(task?.end_date).toDateString() === today.toDateString());
  const nextWeekTasks = tasks?.filter(task => new Date(task?.dueDate) > today && new Date(task?.dueDate) <= nextWeek);
  const recentlyAssignedTasks = tasks?.filter(task => new Date(task?.dueDate) > today && new Date(task?.dueDate) <= threeDaysLater);
  const overdueTasks = tasks?.filter(task => new Date(task?.dueDate) < today);
  const laterTasks = tasks?.filter(task => new Date(task?.dueDate) > nextWeek);

  return (
    <Box sx={{ color: theme.palette.text.primary, bgcolor: theme.palette.background.default }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Do today</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {success?.length > 0 ? (
            <TaskTable tasks={success} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No tasks for today
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Do next week</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {nextWeekTasks?.length > 0 ? (
            <TaskTable tasks={nextWeekTasks} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No tasks for next week
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Recently assigned</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {recentlyAssignedTasks?.length > 0 ? (
            <TaskTable tasks={recentlyAssignedTasks} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No recently assigned tasks
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Do later</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {laterTasks?.length > 0 ? (
            <TaskTable tasks={laterTasks} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No tasks to do later
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Overdue tasks</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {overdueTasks?.length > 0 ? (
            <TaskTable tasks={overdueTasks} onRowClick={handleRowOverdueClick} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No overdue tasks
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default TaskList;
