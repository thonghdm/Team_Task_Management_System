import React, { useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    useTheme,
    Snackbar,
    Alert,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationIcon,
    Send as SendIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const ContactInfoCard = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
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

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease-in-out',
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

const SubmitButton = styled(Button)(({ theme }) => ({
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

const Contact = () => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the form submission
        // For now, we'll just show a success message
        setSnackbar({
            open: true,
            message: 'Message sent successfully! We will get back to you soon.',
            severity: 'success',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        background: theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #64B5F6 30%, #4FC3F7 90%)'
                            : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                    }}
                >
                    Get in Touch
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.7)'
                            : 'rgba(0, 0, 0, 0.7)',
                        maxWidth: '600px',
                        mx: 'auto',
                    }}
                >
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Contact Information */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <ContactInfoCard>
                            <EmailIcon
                                sx={{
                                    fontSize: 32,
                                    color: theme.palette.primary.main,
                                    mr: 2,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                    Email
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.7)'
                                            : 'rgba(0, 0, 0, 0.7)',
                                    }}
                                >
                                    contact@dtproject.com
                                </Typography>
                            </Box>
                        </ContactInfoCard>

                        <ContactInfoCard>
                            <PhoneIcon
                                sx={{
                                    fontSize: 32,
                                    color: theme.palette.primary.main,
                                    mr: 2,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                    Phone
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.7)'
                                            : 'rgba(0, 0, 0, 0.7)',
                                    }}
                                >
                                    +1 (555) 123-4567
                                </Typography>
                            </Box>
                        </ContactInfoCard>

                        <ContactInfoCard>
                            <LocationIcon
                                sx={{
                                    fontSize: 32,
                                    color: theme.palette.primary.main,
                                    mr: 2,
                                }}
                            />
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                    Location
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.7)'
                                            : 'rgba(0, 0, 0, 0.7)',
                                    }}
                                >
                                    123 Street, Ward 9, District 12
                                    <br />
                                    Ho Chi Minh City, Vietnam
                                </Typography>
                            </Box>
                        </ContactInfoCard>
                    </Box>
                </Grid>

                {/* Contact Form */}
                <Grid item xs={12} md={8}>
                    <StyledPaper>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Message"
                                        name="message"
                                        multiline
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <SubmitButton
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            endIcon={<SendIcon />}
                                        >
                                            Send Message
                                        </SubmitButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </StyledPaper>
                </Grid>
            </Grid>

            {/* Snackbar for form submission feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(18, 18, 18, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)'}`,
                    }}
                    action={
                        <IconButton
                            size="small"
                            color="inherit"
                            onClick={handleCloseSnackbar}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Contact; 