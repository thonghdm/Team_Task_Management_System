import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeProjectItem from '~/Components/HomeProjectItem';
import HomeLable from '../HomeLable';
import './styles.css'
import { useTheme } from '@mui/material/styles';

const HomeProjectList = ({project}) => {
  const theme = useTheme();
  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 2 }}>
      <HomeLable lable={"Projects"} />
      <Box className="scrollable">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <HomeProjectItem
              icon={<AddIcon sx={{ color: theme.palette.text.primary }} />}
              title="Create project"
              color="transparent"
            />
          </Grid>

          {project?.map((project, index) => (
            <Grid item xs={6} key={index}>
              <HomeProjectItem
                icon={<Typography sx={{ color: theme.palette.text.primary }}>{project.projectName.charAt(0)}</Typography>} // Use the first letter of the label for the icon
                title={project.projectName}
                color={project.color}
                maxWidth="560px"
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default HomeProjectList;
