import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Button, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeItem from '../HomeItem';
import '../HomeProjectList/styles.css'; // Ensure styles are imported
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux'
import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'

const HomeList = ({upcoming, overdue, completed }) => {
  const [value, setValue] = React.useState(0);
  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // /////
  // const dispatch = useDispatch();
  // const { accesstoken, userData } = useSelector(state => state.auth)
  // const { projects } = useSelector((state) => state.projects);
  // const [projectDetails, setProjectDetails] = useState([]);
  // const refreshToken = useRefreshToken();

  // useEffect(() => {
  //   if (accesstoken && userData?._id) {
  //     dispatch(fetchProjectsByMemberId({ accesstoken, memberId: userData._id }));
  //   }
  // }, [dispatch, accesstoken, userData?._id]);


  // const getAllTasks = (projects) => {
  //   return projects
  //     ?.flatMap(({ project }) =>
  //       // Map through each project's lists
  //       project?.lists?.flatMap(list =>
  //         // Map through each list's tasks
  //         list?.tasks?.map(task => ({
  //           ...task,
  //           projectName: project.projectName,
  //           listName: list.list_name
  //         }))
  //       )
  //     )
  // };
  // useEffect(() => {
  //   const projectIds = projects.projects.map(project => project._id).flat();
  //   if (projectIds.length === 0) return;

  //   const fetchAllProjectDetails = async (token) => {
  //     try {
  //       const details = await Promise.all(
  //         projectIds?.map(projectId =>
  //           dispatch(fetchProjectDetail({ accesstoken: token, projectId }))
  //             .then(response => response.payload)
  //         )
  //       );
  //       if (details.length === 0) return;
  //       setProjectDetails(getAllTasks(details.filter(detail => detail !== undefined)));
  //     } catch (err) {
  //       if (error?.err === 2) {
  //         const newToken = await refreshToken();
  //         return fetchAllProjectDetails(newToken);
  //       }
  //       setError(err.message);
  //       console.error('Error fetching project details:', err);
  //     }
  //   };
  //   fetchAllProjectDetails(accesstoken);
  //   // Cleanup
  //   return () => {
  //     dispatch(resetProjectDetail());
  //   };
  // }, [dispatch, projects, accesstoken]);
  //

  // const categorizeTasks = (tasks) => {
  //   const upcoming = [];
  //   const overdue = [];
  //   const completed = [];
  //   const currentDate = new Date();

  //   tasks?.forEach(task => {
  //     const taskEndDate = new Date(task?.end_date);
  //     if (task?.status === "Completed") {
  //       completed.push(task);
  //     } else if (taskEndDate < currentDate) {
  //       overdue.push(task);
  //     } else {
  //       upcoming.push(task);
  //     }
  //   });

  //   return { upcoming, overdue, completed };
  // };
  // const { upcoming, overdue, completed } = categorizeTasks(projectDetails);

  const colorMapping = {
    upcoming: theme.palette.text.primary,
    overdue: 'red',
    completed: '#339900',
  };

  // Get the tasks for the selected tab
  const selectedTasks =
    value === 0 ? upcoming : value === 1 ? overdue : completed;

  return (
    <Box sx={{ color: theme.palette.text.primary }}>
      <Tabs value={value} onChange={handleChange} sx={{ mb: 2 }}>
        <Tab label="Upcoming" sx={{ color: theme.palette.text.primary }} />
        <Tab label="To Do" sx={{ color: theme.palette.text.primary }} />
        <Tab label="Completed" sx={{ color: theme.palette.text.primary }} />
      </Tabs>

      <Box className="scrollable" sx={{ maxHeight: 300 }}>
        {selectedTasks?.map((task, index) => (
          <HomeItem key={index} task={task?.task_name} endDate={task?.end_date} project={task?.projectName} startDate={task?.start_date}
            color={colorMapping[value === 0 ? 'upcoming' : value === 1 ? 'overdue' : 'completed']}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HomeList;
