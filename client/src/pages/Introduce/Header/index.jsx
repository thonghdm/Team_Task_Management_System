import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    useMediaQuery,
    useTheme,
    Button,
    Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Menu as MenuIcon } from '@mui/icons-material';
// import SearchWithFilters from '../Search';
import { useNavigate } from 'react-router-dom'

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 1px 3px rgba(0,0,0,0.3)'
        : '0 1px 3px rgba(0,0,0,0.1)',
    borderBottom: theme.palette.mode === 'dark'
        ? '1px solid rgba(255,255,255,0.05)'
        : '1px solid rgba(0,0,0,0.05)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '8px 16px',
    color: theme.palette.mode === 'dark' 
        ? theme.palette.grey[300]
        : theme.palette.text.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.08)'
            : 'rgba(0,0,0,0.04)',
        transform: 'translateY(-1px)',
    },
}));

const SignUpButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    padding: '8px 20px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        transform: 'translateY(-1px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.1)',
    },
}));

const BrandTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #64B5F6 30%, #4FC3F7 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
}));

const Header = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // const getSearchWidth = () => {
    //     return 'calc(100% - 500px)';
    // };

    return (
        <StyledAppBar position="fixed">
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 24px',
                    minHeight: '64px',
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: isSmallScreen ? '100px' : '200px',
                }}>
                    <IconButton
                        color="primary"
                        aria-label="open drawer"
                        edge="start"
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? 'rgba(100, 181, 246, 0.08)'
                                    : 'rgba(33, 150, 243, 0.08)',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <BrandTypography 
                        variant="h5" 
                        noWrap 
                        component="div" 
                        sx={{
                            marginLeft: '12px',
                            display: isSmallScreen ? 'none' : 'block',
                        }}
                    >
                        DTPROJECT
                    </BrandTypography>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    margin: '0 24px',
                }}>
                    {/* <SearchWithFilters width={getSearchWidth()} /> */}
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                    <StyledButton
                        color="inherit"
                        onClick={() => navigate('/contact')}
                    >
                        Contact sales
                    </StyledButton>
                    <StyledButton
                        color="inherit"
                        onClick={() => navigate('/sign-in')}
                    >
                        Log in
                    </StyledButton>
                    <SignUpButton
                        onClick={() => navigate('/sign-up')}
                    >
                        Sign up
                    </SignUpButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
};

export default Header;
