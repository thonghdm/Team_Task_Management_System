import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const StyledFooter = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(18, 18, 18, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(8px)',
    borderTop: `1px solid ${theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'}`,
    padding: theme.spacing(6, 0),
    marginTop: 'auto',
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        color: theme.palette.primary.main,
        transform: 'translateX(4px)',
    },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.mode === 'dark'
        ? 'rgba(255, 255, 255, 0.7)'
        : 'rgba(0, 0, 0, 0.7)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        color: theme.palette.primary.main,
        transform: 'translateY(-2px)',
        backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(0, 0, 0, 0.04)',
    },
}));

const Footer = () => {
    const theme = useTheme();

    return (
        <StyledFooter>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Company Info */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            DTPROJECT
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.7)'
                                    : 'rgba(0, 0, 0, 0.7)',
                                mb: 2,
                            }}
                        >
                            Empowering teams to work together efficiently and effectively.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <SocialIconButton aria-label="facebook">
                                <FacebookIcon />
                            </SocialIconButton>
                            <SocialIconButton aria-label="twitter">
                                <TwitterIcon />
                            </SocialIconButton>
                            <SocialIconButton aria-label="linkedin">
                                <LinkedInIcon />
                            </SocialIconButton>
                            <SocialIconButton aria-label="github">
                                <GitHubIcon />
                            </SocialIconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Product
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FooterLink href="#">Features</FooterLink>
                            <FooterLink href="#">Pricing</FooterLink>
                            <FooterLink href="#">Enterprise</FooterLink>
                            <FooterLink href="#">Security</FooterLink>
                        </Box>
                    </Grid>

                    {/* Resources */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Resources
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FooterLink href="#">Documentation</FooterLink>
                            <FooterLink href="#">Guides</FooterLink>
                            <FooterLink href="#">API Reference</FooterLink>
                            <FooterLink href="#">Community</FooterLink>
                        </Box>
                    </Grid>

                    {/* Company */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Company
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FooterLink href="#">About</FooterLink>
                            <FooterLink href="#">Blog</FooterLink>
                            <FooterLink href="#">Careers</FooterLink>
                            <FooterLink href="#">Contact</FooterLink>
                        </Box>
                    </Grid>

                    {/* Legal */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                mb: 2,
                                color: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.9)'
                                    : 'rgba(0, 0, 0, 0.9)',
                            }}
                        >
                            Legal
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <FooterLink href="#">Privacy</FooterLink>
                            <FooterLink href="#">Terms</FooterLink>
                            <FooterLink href="#">Cookie Policy</FooterLink>
                            <FooterLink href="#">Licenses</FooterLink>
                        </Box>
                    </Grid>
                </Grid>

                {/* Copyright */}
                <Box
                    sx={{
                        mt: 6,
                        pt: 3,
                        borderTop: `1px solid ${theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)'}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.7)'
                                : 'rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        {'© '}
                        {new Date().getFullYear()}
                        {' DTPROJECT. All rights reserved.'}
                    </Typography>
                </Box>
            </Container>
        </StyledFooter>
    );
};

export default Footer;