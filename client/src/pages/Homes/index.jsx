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

import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'


const Homes = () => {
  const theme = useTheme();
  const dispatch = useDispatch()
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)

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
              alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
              dispatch({
                type: actionTypes.LOGOUT,
              });
              navigate('/');
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


  ////////////////////////////////
  /////// HomeList Component ///////
  const { projects } = useSelector((state) => state.projects);
  const [projectDetails, setProjectDetails] = useState([]);
  const refreshToken = useRefreshToken();

  useEffect(() => {
    if (accesstoken && userData?._id) {
      dispatch(fetchProjectsByMemberId({ accesstoken, memberId: userData._id }));
    }
  }, [dispatch, accesstoken, userData?._id]);


  const getAllTasks = (projects) => {
    return projects
      ?.flatMap(({ project }) =>
        // Map through each project's lists
        project?.lists?.flatMap(list =>
          // Map through each list's tasks
          list?.tasks?.map(task => ({
            ...task,
            projectName: project.projectName,
            listName: list.list_name
          }))
        )
      )
  };
  useEffect(() => {
    const projectIds = projects.projects.map(project => project._id).flat();
    if (projectIds.length === 0) return;

    const fetchAllProjectDetails = async (token) => {
      try {
        const details = await Promise.all(
          projectIds?.map(projectId =>
            dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
              .then(response => response.payload)
          )
        );
        if (details.length === 0) return;
        setProjectDetails(getAllTasks(details.filter(detail => detail !== undefined)));
      } catch (err) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return fetchAllProjectDetails(newToken);
        }
        setError(err.message);
        console.error('Error fetching project details:', err);
      }
    };
    fetchAllProjectDetails(accesstoken);
    // Cleanup
    return () => {
      dispatch(resetProjectDetail());
    };
  }, [dispatch, projects, accesstoken]);

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

    tasks?.forEach(task => {
      const taskEndDate = new Date(task?.end_date);
      if (task?.status === "Completed") {
        if (taskEndDate >= periodStartDate && taskEndDate <= currentDate) {
          completed.push(task);
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

  // Usage
  const { upcoming, overdue, completed } = categorizeTasks(projectDetails, period);

  // Period change handler
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const transformData = (tasks,period) => {
    const { upcoming, overdue, completed } = categorizeTasks(tasks, period);
    // Combine all tasks into one array with additional date format parsing
    const allTasks = [
      ...upcoming.map(task => ({ ...task, category: "due" })),
      ...overdue.map(task => ({ ...task, category: "due" })),
      ...completed.map(task => ({ ...task, category: "completed" })),
    ];
    // Group by dates
    const taskByDate = allTasks.reduce((acc, task) => {
      const formattedDate = new Date(task.end_date).toLocaleDateString("en-GB");
      if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate, due: 0, completed: 0 };
      }
      acc[formattedDate][task.category] += 1;
      return acc;
    }, {});

    // Transform into an array
    return Object.values(taskByDate);
  };
  const dataStatics = transformData(projectDetails, period);

  const displayName = data?.displayName ? data.displayName.match(/^\S+/)[0] : 'User';
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

      <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary }}>
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
        <HomeList upcoming={upcoming} overdue={overdue} completed={completed} />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 2 }}>
        <Box sx={{ flexBasis: '100%' }}>
          {projects?.projects && <HomeProjectList project={projects?.projects} />}
        </Box>
        {/* <Box sx={{ flexBasis: '50%' }}>
          <HomeProflieList />
        </Box> */}
      </Box>

      {upcoming && <HomeChart upcoming={upcoming} overdue={overdue} completed={completed} dataStatics={dataStatics} />}
    </Box>
  );
};

export default Homes;
