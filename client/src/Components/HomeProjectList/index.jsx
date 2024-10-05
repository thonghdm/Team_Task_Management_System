import React from 'react';
import { Box, Typography, Paper, Grid, IconButton } from '@mui/material';
import { Add as AddIcon, MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import HomeProjectItem from '~/Components/HomeProjectItem';

const projectsLinkData = [
  { label: 'Cross-functional project p...', link: 'project1', color: '#00BCD4' },
  { label: 'My first portfolio', link: 'project2', color: '#9E9E9E' },
  { label: 'uijjj', link: 'project3', color: '#2196F3' },
];

const HomeProjectList = () => {
  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#333', color: 'white', mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Projects</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton sx={{ color: 'white' }}>
          <MoreHorizIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <HomeProjectItem
            icon={<AddIcon sx={{ color: 'white' }} />}
            title="Create project"
            color="transparent"
          />
        </Grid>

        {projectsLinkData.map((project, index) => (
          <Grid item xs={6} key={index}>
            <HomeProjectItem
              icon={<Typography sx={{ color: 'white' }}>{project.label.charAt(0)}</Typography>} // Use the first letter of the label for the icon
              title={project.label}
              color={project.color}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default HomeProjectList;
