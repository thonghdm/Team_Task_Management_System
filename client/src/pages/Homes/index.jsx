import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Avatar, Chip, IconButton, Tab, Tabs, MenuItem, Select } from '@mui/material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import HomeList from '~/Components/HomeList';
import HomeProjectList from '~/Components/HomeProjectList';
import HomeProflieList from '~/Components/HomeProflieList';
import HomeChart from '~/Components/HomeChart';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import { logout } from '~/redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux'
import { apiGetOne } from '~/apis/User/userService'
import { formattedDate } from '~/utils/formattedDate';
import { getTimeOfDay } from '~/utils/getTimeOfDay';
import { apiRefreshToken } from '~/apis/Auth/authService';
import actionTypes from '~/redux/actions/actionTypes';

import { getTaskByMemberIDThunk } from '~/redux/project/task-slice/task-inviteUser-slice/index'

import ChangeList from '~/pages/Projects/Content/TaskBoard/ChangeList';

import { getAllSubPlan } from '~/apis/Project/subscriptionPlan';
import { createSubscriptionFree } from '~/apis/Project/subscriptionApi';

const Homes = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // let response = await apiGetOne(accesstoken)
      } catch (error) {
        if (error.status === 401) {
          try {
            const response = await apiRefreshToken();
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              data: { accesstoken: response.data.token, typeLogin: true, userData: response.data.userData }
            })
          }
          catch (error) {
            console.log("error", error);
            if (error.status === 403) {
              alert("Your session has expired, please log in again.");
              dispatch({
                type: actionTypes.LOGOUT,
              });
              navigate('/sign-in');
            }
          }
        } else {
          console.log(error.message);
        }
      }
    }
    if (isLoggedIn) { fetchUser() }
  }, [isLoggedIn, accesstoken, typeLogin])
  let data = isLoggedIn ? userData : {};

  // const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  // const [date, setDate] = useState(formattedDate);

  // useEffect(() => {
  //   setDate(formattedDate);
  //   setTimeOfDay(getTimeOfDay());
  // }, []);
  const { projects } = useSelector((state) => state.projects);


  ////////////////////////////////
  /////// HomeList Component ///////

  ////
  const { success } = useSelector(state => state.taskInviteUser)
  console.log("success", success);
  useEffect(() => {
    dispatch(getTaskByMemberIDThunk({ accesstoken, memberID: userData?._id }));
  }, [dispatch, userData?._id, accesstoken]);
  ////

  const [period, setPeriod] = useState('last7days');

  const categorizeTasks = (tasks, period) => {
    const upcoming = [];
    const overdue = [];
    const completed = [];
    const currentDate = new Date();
    let periodStartDate = new Date();

    switch (period) {
      case 'last7days':
        periodStartDate.setDate(currentDate.getDate() - 7);
        break;
      case 'last30days':
        periodStartDate.setDate(currentDate.getDate() - 30);
        break;
      default:
        periodStartDate = new Date(0);
    }

    // Filter active projects first
    const activeTasks = Array.isArray(tasks) 
      ? tasks.filter(task => task?.task_id?.project_id?.isActive === true)
      : [];

    activeTasks?.forEach(task => {
      const taskEndDate = new Date(task?.task_id?.end_date);
      const taskDone = new Date(task?.task_id?.done_date);
      if (task?.task_id?.status === "Completed") {
        if (taskEndDate >= periodStartDate) {
          if (taskEndDate >= taskDone) {
            completed.push(task);
          } else {
            overdue.push(task);
          }
        }
      } else if (taskEndDate < currentDate) {
        if (taskEndDate >= periodStartDate) {
          overdue.push(task);
        }
      } else {
        if (taskEndDate >= periodStartDate) {
          upcoming.push(task);
        }
      }
    });

    return { upcoming, overdue, completed };
  };


  const { upcoming, overdue, completed } = categorizeTasks(success, period);
  // Period change handler
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const transformData = (tasks, period) => {
    const { upcoming, overdue, completed } = categorizeTasks(tasks, period);
    // Combine all tasks into one array with additional date format parsing
    const allTasks = [
      ...upcoming.map(task => ({ ...task, category: "coming" })),
      ...overdue.map(task => ({ ...task, category: "due" })),
      ...completed.map(task => ({ ...task, category: "completed" })),
    ];
    // Group by dates
    const taskByDate = allTasks.reduce((acc, task) => {
      const formattedDate = new Date(task?.task_id?.end_date).toLocaleDateString("en-GB");
      if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate, due: 0, completed: 0, coming: 0 };
      }
      acc[formattedDate][task.category] += 1;
      return acc;
    }, {});

    // Transform into an array
    return Object.values(taskByDate);
  };

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


  //////////////////////////// openProjectDetail
  const handleProjectClick = (projectId) => {
    navigate(`/board/${projectId}/2/task-board`);
  }


  const dataStatics = transformData(success, period);

  const displayName = data?.displayName ? data.displayName.match(/^\S+/)[0] : 'User';

  ///////////////////////

  const [subPlan, setSubPlan] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getAllSubPlan(accesstoken);
        setSubPlan(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUser();
  }, [accesstoken])


  const IdfreePlan = subPlan?.plans?.find(plan => plan.subscription_type === "Free");

  useEffect(() => {
    let data = {
      userId: userData?._id,
      planId: IdfreePlan,
    }
    const fetchUser = async () => {
      try {
        await createSubscriptionFree(accesstoken, data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUser();
  }, [accesstoken, userData])

  // ///


  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: theme.palette.grey[50], minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: theme.palette.text.primary, mb: 2 }}>Home</Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>{formattedDate}</Typography>
        <Typography variant="h3" sx={{ color: theme.palette.text.primary }}>Good {getTimeOfDay()}, {displayName}</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Chip
            label="My month"
            variant="outlined"
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.text.primary, mr: 1 }}
          />
          <Chip
            label={completed.length + " tasks completed"}
            icon={<span style={{ color: theme.palette.text.primary }}>✓</span>}
            variant="outlined"
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.text.primary, mr: 1 }}
          />
          <Chip
            label="0 collaborators"
            icon={<span style={{ color: theme.palette.text.primary }}>👥</span>}
            variant="outlined"
            sx={{ color: theme.palette.text.primary, borderColor: theme.palette.text.primary }}
          />
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 1, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 1 }}
            src={data?.image ? data?.image : undefined}
          >{!data?.image && data?.displayName} </Avatar>
          <Typography variant="h6">My tasks</Typography>
          <Box sx={{ flexGrow: 1 }} />


          <Select
            value={period}
            onChange={handlePeriodChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="last7days">Last 7 days</MenuItem>
            <MenuItem value="last30days">Last 30 days</MenuItem>
          </Select>


        </Box>
        <HomeList upcoming={upcoming} overdue={overdue} completed={completed} onRowClick={handleRowClick} />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
        <Box sx={{ flexBasis: '100%' }}>
          {projects?.projects && <HomeProjectList project={projects?.projects} onClickProject={handleProjectClick} />}
        </Box>
        {/* <Box sx={{ flexBasis: '50%' }}>
          <HomeProflieList />
        </Box> */}
      </Box>
      {upcoming && <HomeChart upcoming={upcoming} overdue={overdue} completed={completed} dataStatics={dataStatics} />}

      {showNameMenu && selectedTask && (
        <ChangeList open={showNameMenu} onClose={handleCloseNameMenu} taskId={selectedTask} />
      )}

    </Box>
  );
};

export default Homes;
