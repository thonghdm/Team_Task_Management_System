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
import { useDispatch, useSelector } from 'react-redux'

import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'

import ChangeList from '~/pages/Projects/Content/TaskBoard/ChangeList';

const TaskList = () => {
  const theme = useTheme();

  ////
  const dispatch = useDispatch()
  const { accesstoken, userData } = useSelector(state => state.auth)
  const { success } = useSelector(state => state.taskInviteUser)
  useEffect(() => {
    dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
  }, [dispatch, userData?._id, accesstoken]);
  ////


  
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);



  // Task Filtering
  const todayTasks = Array.isArray(success) ? success.filter(task => {
    const taskEndDate = new Date(task?.task_id?.end_date);
    return task?.task_id?.project_id?.isActive === true && 
           taskEndDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  }) : [];

  const nextWeekTasks = Array.isArray(success) ? success.filter(task => {
    const dueDate = new Date(task?.task_id?.end_date)
    return task?.task_id?.project_id?.isActive === true && 
           dueDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0) && 
           dueDate.setHours(0, 0, 0, 0) <= nextWeek.setHours(0, 0, 0, 0);
  }) : [];

  const recentlyAssignedTasks = Array.isArray(success) ? success.filter(task => {
    const dueDate = new Date(task?.task_id?.end_date)
    return task?.task_id?.project_id?.isActive === true && 
           dueDate.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0) && 
           dueDate.setHours(0, 0, 0, 0) <= threeDaysLater.setHours(0, 0, 0, 0);
  }) : [];

  const overdueTasks = Array.isArray(success) ? success.filter(task => {
    const dueDate = new Date(task?.task_id?.end_date)
    return task?.task_id?.project_id?.isActive === true && 
           dueDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
  }) : [];

  const laterTasks = Array.isArray(success) ? success.filter(task => {
    const dueDate = new Date(task?.task_id?.end_date)
    return task?.task_id?.project_id?.isActive === true && 
           dueDate.setHours(0, 0, 0, 0) > nextWeek.setHours(0, 0, 0, 0)
  }) : [];

////////////////////////////////openTaskDetail
const [showNameMenu, setShowNameMenu] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);

const handleOpenNameMenu = (task) => {
  setSelectedTask(task);
  setShowNameMenu(true);
};
const handleCloseNameMenu = () => {
  setShowNameMenu(false);
  setSelectedTask(null);
};

const handleNameClick = (taskId) => {
  handleOpenNameMenu(taskId);
};

const handleRowClick = (taskId) => {
  handleNameClick(taskId)
};

  ////////////////////////////////////////////////////////////////



  return (
    <Box sx={{ color: theme.palette.text.primary, bgcolor: theme.palette.background.default }}>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Do today</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {todayTasks?.length > 0 ? (
            <TaskTable tasks={todayTasks} onRowClick={handleRowClick} />
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
            <TaskTable tasks={nextWeekTasks} onRowClick={handleRowClick}/>
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
            <TaskTable tasks={recentlyAssignedTasks} onRowClick={handleRowClick} />
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
            <TaskTable tasks={laterTasks} onRowClick={handleRowClick} />
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
            <TaskTable tasks={overdueTasks} onRowClick={handleRowClick} />
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.primary, fontStyle: 'italic' }}>
              No overdue tasks
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {showNameMenu && selectedTask && (
        <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
      )}
      
    </Box>
  );
};

export default TaskList;
