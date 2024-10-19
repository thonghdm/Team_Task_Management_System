import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Button,
    Select,
    MenuItem,
    Paper,
    Grid,
    Chip,
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

const ProjectBlank = () => {
    const [projectName, setProjectName] = useState();
    const [projectUse, setProjectUse] = useState('To conduct initial testing or data analysis as part of a broader organizational initiative.');
    const [defaultView, setDefaultView] = useState('list');

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setDefaultView(newView);
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
                                    mt: "5px",
                                    // Thêm box-shadow vào input
                                    '& .MuiInputBase-root': {
                                        boxShadow: '0 0 0 100px rgba(38, 103, 152, 0.5) inset', // Sử dụng rgba để điều chỉnh độ trong suốt
                                    },
                                },
                            }}
                            sx={{
                                mb: 2,
                            }}
                        />

                    </Box>
                    <Box>
                        <FormLabel sx={{ color: 'text.secondary', fontWeight: 'bold' }} htmlFor="Privacy">Privacy</FormLabel>
                        <Box sx={{ mt: "5px" }}>
                            <Select
                                value="My workspace"
                                fullWidth
                                displayEmpty
                                renderValue={() => "My workspace"}
                                sx={{ height: '40px' }}
                            >
                                <MenuItem value="My workspace">My workspace</MenuItem>
                            </Select>
                        </Box>
                    </Box>


                    <Box  sx={{marginTop:'20px'}}>
                        <FormLabel sx={{color: 'text.secondary', fontWeight: 'bold' }} htmlFor="Projectname">Default view</FormLabel>
                        <ToggleButtonGroup
                            value={defaultView}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="default view"
                            sx={{marginTop:'10px'}}
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
                    <Button variant="contained" fullWidth sx={{ mt: 3 }}>
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