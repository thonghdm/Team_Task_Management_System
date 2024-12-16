import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Paper,
    FormLabel,
} from '@mui/material';
import Header from '../Header';
import ProjectTable from './ProjectTable';
import {
    List as ListIcon,
    Dashboard as BoardIcon,
    Timeline as TimelineIcon,
    CalendarToday as CalendarIcon
} from '@mui/icons-material';
import RoleSelect from '~/Components/ProjectRoleSelect';
import { useTheme } from '@mui/material/styles';
import { createNew } from '~/apis/Project/projectService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { getRandomColor } from '~/utils/radomColor';


const roles = [
    { value: 'Public', label: 'My workspace', description: 'Everyone in your workspace can find and access this project.' },
    { value: 'Member', label: 'Private to members', description: 'Only invited members can find and access this project' },
];

const ProjectBlank = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [projectName, setProjectName] = useState('');
    const [defaultView, setDefaultView] = useState('list');
    const [privacy, setPrivacy] = useState('Public');
    const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)
    


    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setDefaultView(newView);
        }
    };
    const refreshToken = useRefreshToken();

    const handleSubmit = async () => {
        
        const projectData = {
            projectName,
            visibility: privacy,
            ownerId: userData._id,
            membersId: [userData._id],
            color: getRandomColor(),
        };
    
        const resetFormState = () => {
            setProjectName('');
            setPrivacy('Public');
            setDefaultView('list');
        };
    
        const handleSuccess = (message) => {
            toast.success(message || 'Project created successfully!');
            resetFormState();
        };
    
        const createProject = async (token) => {
            try {
                const response = await createNew(token, projectData);
                handleSuccess(response.message);
                console.log(response)
                navigate('/board/' + response.project.createdProject._id+'/2/project-board');
            } catch (error) {
                if (error.response?.status === 401) {
                    const newToken = await refreshToken();
                    return createProject(newToken); // Retry with new token
                }
                throw error;
            }
        };
    
        try {
            await createProject(accesstoken);
        } catch (error) {
            toast.error('Error: Project name is too short (minimum 3 characters)');
        }
    };
    

    return (
        <Box sx={{ bgcolor: 'background.pager', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
                <Header />
            </Box>
            <Box sx={{ display: 'flex', color: 'text.primary', mt: '64px', width: '83%' }}>
                <Box sx={{ width: '35%', p: 1 }}>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }} variant="h4" gutterBottom>
                        New project
                    </Typography>
                    <Box>
                        <FormLabel sx={{ color: 'text.secondary', fontWeight: 'bold' }} htmlFor="Projectname">Project name</FormLabel>
                        <TextField
                            fullWidth
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            InputProps={{
                                sx: {
                                    height: '40px',
                                    mt: '5px',
                                    '& .MuiOutlinedInput-root': {
                                        boxShadow: 'none',
                                    },
                                    '& input:-webkit-autofill': {
                                        '-webkit-box-shadow': `0 0 0 100px ${theme.palette.background.default} inset !important`,
                                    },
                                },
                            }}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                    <Box>
                        <FormLabel sx={{ color: 'text.secondary', fontWeight: 'bold' }} htmlFor="Privacy">Privacy</FormLabel>
                        <Box sx={{ mt: "5px" }}>
                            <RoleSelect
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                DB={roles}
                                fullWidth
                            />
                        </Box>
                    </Box>

                    <Box sx={{ marginTop: '20px' }}>
                        <FormLabel sx={{ color: 'text.secondary', fontWeight: 'bold' }} htmlFor="Projectname">Default view</FormLabel>
                        <ToggleButtonGroup
                            value={defaultView}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="default view"
                            sx={{ marginTop: '10px' }}
                        >
                            <ToggleButton value="list" aria-label="list">
                                <ListIcon /> List
                            </ToggleButton>
                            <ToggleButton value="board" aria-label="board">
                                <BoardIcon /> Board
                            </ToggleButton>
                            <ToggleButton value="timeline" aria-label="timeline">
                                <TimelineIcon /> Timeline
                            </ToggleButton>
                            <ToggleButton value="calendar" aria-label="calendar">
                                <CalendarIcon /> Calendar
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
                        Create project
                    </Button>
                </Box>
                <Box sx={{ width: '65%', p: 3 }}>
                    <Paper sx={{ p: 1, bgcolor: 'background.paper' }}>
                        <ProjectTable />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};

export default ProjectBlank;
