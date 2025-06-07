import React from 'react';
import { Container, Typography, Box, Button, useTheme, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import img12 from '../../../../public/introduce/12.png';
import img31 from '../../../../public/introduce/31.png';
import img3 from '../../../../public/introduce/3.png';
import img4 from '../../../../public/introduce/4.png';
import img5 from '../../../../public/introduce/5.png';
import { useNavigate } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const StyledImg = styled('img')(({ theme }) => ({
    transition: 'all 0.3s ease-in-out',
    filter: theme.palette.mode === 'dark' ? 'brightness(0.8) invert(1)' : 'none',
    '&:hover': {
        transform: 'translateY(-2px)',
        filter: theme.palette.mode === 'dark' ? 'brightness(1) invert(1)' : 'brightness(1.1)',
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '12px',
    padding: '12px 32px',
    fontSize: '1.1rem',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.1)',
    }
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #64B5F6 30%, #4FC3F7 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
}));

const Content = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/sign-in');
    };

    const handleViewDemo = () => {
        window.open('https://www.youtube.com/watch?v=_F9GYUJPxGw', '_blank');
    };

    return (
        <Container maxWidth="lg" sx={{ 
            mt: "140px",
            color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                py: 8,
            }}>
                <GradientTypography
                    variant="h2"
                    sx={{ 
                        fontWeight: 700,
                        mb: 3,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        lineHeight: 1.2,
                    }}
                >
                    Where work connects
                </GradientTypography>

                <Typography
                    variant="h5"
                    sx={{ 
                        mb: 6,
                        maxWidth: '800px',
                        color: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                        fontSize: { xs: '1.1rem', md: '1.5rem' },
                        lineHeight: 1.5,
                    }}
                >
                    Get everyone working in a single platform designed to manage any type of work.
                </Typography>

                <Box sx={{ 
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    mb: 8
                }}>
                    <Stack direction="row" spacing={2}>
                        <StyledButton 
                            variant="contained"
                            color="primary"
                            onClick={handleGetStarted}
                        >
                            Get started
                        </StyledButton>
                        <StyledButton 
                            variant="outlined"
                            color="primary"
                            onClick={handleViewDemo}
                            startIcon={<PlayCircleOutlineIcon />}
                        >
                            View Demo
                        </StyledButton>
                    </Stack>
                </Box>
            </Box>

            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: 8,
                mt: 8,
                borderTop: `1px solid ${theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)'}`,
            }}>
                <Typography
                    variant="h6"
                    sx={{ 
                        mb: 6,
                        color: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                        fontWeight: 500,
                    }}
                >
                    Trusted by 2 million+ teams
                </Typography>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <StyledImg sx={{ height: { xs: 40, sm: 50, md: 65 } }} src={img12} alt="monday.com" />
                    <StyledImg sx={{ height: { xs: 45, sm: 55, md: 70 } }} src={img31} alt="monday.com" />
                    <StyledImg sx={{ height: { xs: 45, sm: 55, md: 70 } }} src={img3} alt="monday.com" />
                    <StyledImg sx={{ height: { xs: 45, sm: 55, md: 70 } }} src={img4} alt="monday.com" />
                    <StyledImg sx={{ height: { xs: 40, sm: 50, md: 60 } }} src={img5} alt="monday.com" />
                </Box>
            </Box>
        </Container>
    );
};

export default Content;