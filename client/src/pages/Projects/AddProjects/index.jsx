import React from 'react';
import { Box, Typography, Button, Container, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TableChartIcon from '@mui/icons-material/TableChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useLocation, Outlet } from 'react-router-dom'; // Import Outlet
import Header from './Header';

const AddProjects = () => {
    const navigate = useNavigate();

    
    return (
        <Box sx={{ bgcolor: 'background.pager', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Header />
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', mt: 'auto', mb: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                    Create a new project
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    How would you like to start?
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                    <Button
                        variant="outlined"
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: 'text.secondary',
                            color: 'text.primary',
                            transition: 'transform 0.3s, margin-top 0.3s',
                            '&:hover': {
                                marginTop: -2,
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => navigate('blank')}
                    >
                        <AddIcon sx={{ fontSize: 40, m: 1 }} />
                        <Typography variant="caption" color="text.secondary">Blank project</Typography>
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: 'text.secondary',
                            color: 'text.primary',
                            transition: 'transform 0.3s, margin-top 0.3s',
                            '&:hover': {
                                marginTop: -2,
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <RocketLaunchIcon sx={{ fontSize: 40, m: 1, color: 'primary.main' }} />
                        <Typography variant="caption" color="text.secondary">Use a template</Typography>
                    </Button>

                    <Button
                        variant="outlined"
                        sx={{
                            width: 120,
                            height: 120,
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: 'text.secondary',
                            color: 'text.primary',
                            transition: 'transform 0.3s, margin-top 0.3s',
                            '&:hover': {
                                marginTop: -2,
                                transform: 'scale(1.05)',
                            },
                        }}
                        onClick={() => navigate('import-sheet')}
                    >
                        <TableChartIcon sx={{ fontSize: 40, m: 1, color: 'success.main' }} />
                        <Typography variant="caption">Import spreadsheet</Typography>
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default AddProjects;
