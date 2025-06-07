import { styled } from '@mui/material/styles';
import {
    Typography,
    Button,
    TextField,
    Paper,
    Box,
    Card,
    Divider,
} from '@mui/material';

// Typography Components
export const GradientTypography = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    background: theme.palette.mode === 'dark'
        ? 'linear-gradient(45deg, #64B5F6 30%, #4FC3F7 90%)'
        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.9)'
        : 'rgba(0, 0, 0, 0.9)',
    marginBottom: theme.spacing(2),
}));

export const SectionSubtitle = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
    maxWidth: '600px',
    margin: '0 auto',
}));

// Button Components
export const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '12px 32px',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

export const OutlinedButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '12px 32px',
    textTransform: 'none',
    fontSize: '1.1rem',
    fontWeight: 600,
    borderWidth: '2px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        borderWidth: '2px',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 4px 12px rgba(0, 0, 0, 0.3)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

// Form Components
export const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease-in-out',
        height: '40px',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)',
        },
    },
}));

// Container Components
export const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'}`,
}));

export const StyledCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
    borderRadius: '12px',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
    },
}));

export const AuthCard = styled(Card)(({ theme }) => ({
    padding: '2rem',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark'
        ? '0 4px 20px rgba(0, 0, 0, 0.3)'
        : '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'}`,
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    '&::before, &::after': {
        borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)',
    },
}));

// Utility Functions
export const getTextColor = (theme) => ({
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
});

export const getBackgroundColor = (theme) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.05)'
        : 'rgba(0, 0, 0, 0.02)',
}); 