import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeProjectItem from '~/Components/HomeProjectItem';
import { getRandomColor } from '~/utils/radomColor';
import HomeLable from '../HomeLable';
import './styles.css'


const projectsLinkData = [
  { label: 'Cross-functional project p...', link: 'project1' },
  { label: 'My first portfolio', link: 'project2' },
  { label: 'uijjj', link: 'project3' },
  { label: 'Cross-functional project p...', link: 'project1' },
  { label: 'My first portfolio', link: 'project2' },
  { label: 'uijjj', link: 'project3' },
  { label: 'Cross-functional project p...', link: 'project1' },
  { label: 'My first portfolio', link: 'project2' },
  { label: 'uijjj', link: 'project3' }
];

const HomeProjectList = () => {
  const [projectColors, setProjectColors] = useState([]);

  useEffect(() => {
    const colors = projectsLinkData.map(() => getRandomColor());
    setProjectColors(colors);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#333', color: 'white', mt: 3 }}>
      <HomeLable lable={"Projects"} />
      <Box className="scrollable">
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
                color={projectColors[index]} // Apply the stored random color
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default HomeProjectList;
