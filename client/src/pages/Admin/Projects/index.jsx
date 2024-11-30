import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import ProjectsTable from './ProjectsTable';
import SearchIcon from '@mui/icons-material/Search';

import { fetchProjectsThunk } from '~/redux/project/project-slice/index';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { project } = useSelector((state) => state.projectThunk);


  const dispatch = useDispatch();
  const { accesstoken } = useSelector(state => state.auth)

  const refreshToken = useRefreshToken();
  useEffect(() => {
    const getAllProjects = async (token) => {
      try {
        await dispatch(fetchProjectsThunk({ accesstoken: token })).unwrap();
      } catch (error) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return getAllProjects(newToken);
        }
        toast.error(error.response?.data.message || 'Unable to load project information!');
      }
    };

    getAllProjects(accesstoken);

  }, [dispatch, accesstoken]);


  const separateActiveInactiveProjects = (projects) => {
    const activeProjects = projects?.filter(project => project?.isActive);
    const deletedProjects = projects?.filter(project => !project?.isActive);

    return { activeProjects, deletedProjects };
  };

  const { activeProjects, deletedProjects } = separateActiveInactiveProjects(project?.projects);

  // // Active Projects Data
  // const activeProjects = [
  //   {
  //     _id: '1115511',
  //     name: 'E-commerce Website',
  //     client: 'Tech Solutions Inc.',
  //     visibility: 'Public',
  //     deadline: '2024-12-31',
  //     team: 5,
  //     startDate: '2024-01-15'
  //   },
  //   {
  //     _id: '11523',
  //     name: 'Mobile Banking App',
  //     client: 'Global Bank',
  //     visibility: 'Public',
  //     deadline: '2025-03-15',
  //     team: 8,
  //     startDate: '2024-02-01'
  //   },
  //   {
  //     _id: '1511',
  //     name: 'HR Management Portal',
  //     client: 'ABC Company',
  //     visibility: 'Public',
  //     deadline: '2024-11-30',
  //     team: 4,
  //     startDate: '2024-03-10'
  //   },
  //   {
  //     _id: '32341',
  //     name: 'Analytics Dashboard',
  //     client: 'Data Insights Ltd',
  //     visibility: 'Public',
  //     deadline: '2025-01-15',
  //     team: 3,
  //     startDate: '2024-04-01'
  //   },
  //   {
  //     _id: '116723',
  //     name: 'Mobile Banking App',
  //     client: 'Global Bank',
  //     visibility: 'Public',
  //     deadline: '2025-03-15',
  //     team: 8,
  //     startDate: '2024-02-01'
  //   },
  //   {
  //     _id: '1611',
  //     name: 'HR Management Portal',
  //     client: 'ABC Company',
  //     visibility: 'Public',
  //     deadline: '2024-11-30',
  //     team: 4,
  //     startDate: '2024-03-10'
  //   },
  //   {
  //     _id: '351',
  //     name: 'Analytics Dashboard',
  //     client: 'Data Insights Ltd',
  //     visibility: 'Public',
  //     deadline: '2025-01-15',
  //     team: 3,
  //     startDate: '2024-04-01'
  //   },
  //   {
  //     _id: '11243',
  //     name: 'Mobile Banking App',
  //     client: 'Global Bank',
  //     visibility: 'Public',
  //     deadline: '2025-03-15',
  //     team: 8,
  //     startDate: '2024-02-01'
  //   },
  //   {
  //     _id: '111111',
  //     name: 'HR Management Portal',
  //     client: 'ABC Company',
  //     visibility: 'Public',
  //     deadline: '2024-11-30',
  //     team: 4,
  //     startDate: '2024-03-10'
  //   },
  //   {
  //     _id: '3111',
  //     name: 'Analytics Dashboard',
  //     client: 'Data Insights Ltd',
  //     visibility: 'Public',
  //     deadline: '2025-01-15',
  //     team: 3,
  //     startDate: '2024-04-01'
  //   },
  //   {
  //     _id: '3111111',
  //     name: 'Analytics Dashboard',
  //     client: 'Data Insights Ltd',
  //     visibility: 'Public',
  //     deadline: '2025-01-15',
  //     team: 3,
  //     startDate: '2024-04-01'
  //   },

  // ];

  // // Archived Projects Data
  // const archivedProjects = [
  //   {
  //     _id: '1',
  //     name: 'CRM System',
  //     client: 'Sales Corp',
  //     visibility: 'Member',
  //     deadline: '2024-10-01',
  //     team: 6,
  //     startDate: '2023-10-15',
  //     completedDate: '2024-03-20',
  //     // archiveReason: 'Project Completed Successfully'
  //   },
  //   {
  //     _id: '2',
  //     name: 'Company Website Redesign',
  //     client: 'Fashion Brands Co',
  //     visibility: 'Member',
  //     deadline: '2024-02-28',
  //     team: 4,
  //     startDate: '2023-11-01',
  //     completedDate: '2024-02-25',
  //     // archiveReason: 'Project Completed Successfully'
  //   },
  //   {
  //     _id: '3',
  //     name: 'Inventory Management System',
  //     client: 'Retail Solutions',
  //     visibility: 'Member',
  //     deadline: '2024-06-30',
  //     team: 5,
  //     startDate: '2023-12-01',
  //     completedDate: '2024-01-15',
  //     // archiveReason: 'Client Budget Constraints'
  //   }
  // ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchQuery(''); // Reset search when switching tabs
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter projects based on search query
  const filterProjects = (projects) => {
    if (!searchQuery) return projects;

    const query = searchQuery.toLowerCase();
    return projects.filter(project =>
      project.projectName.toLowerCase().includes(query) ||
      project.ownerId.displayName.toLowerCase().includes(query) ||
      project.visibility.toLowerCase().includes(query)
    );
  };

  return (
    <Box sx={{ p: 3, mt: "70px" }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Projects Management
        </Typography>
        {/* <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          sx={{ display: tabValue === 0 ? 'flex' : 'none' }}
        >
          Add Project
        </Button> */}
      </Box>

      <Card>
        <CardContent>
          {/* Tabs and Refresh */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label={`Active Projects (${activeProjects?.length})`} />
              <Tab label={`Archived Projects (${deletedProjects?.length})`} />
            </Tabs>
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Search Field */}
          <TextField
            placeholder="Search projects..."
            variant="outlined"
            fullWidth
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Active/Archived Projects Table */}
          {/* Active/Archived Projects Table */}
          {tabValue === 0 ? (
            activeProjects && (
              <ProjectsTable
                projects={filterProjects(activeProjects)}
                isArchived={false}
              />
            )
          ) : (
            deletedProjects && (
              <ProjectsTable
                projects={filterProjects(deletedProjects)}
                isArchived={true}
              />
            )
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Projects;