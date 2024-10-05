import React from 'react';
import { Box, Typography, Paper, Avatar, Chip, IconButton, Tab, Tabs } from '@mui/material';
import { MoreHoriz as MoreHorizIcon, Add as AddIcon } from '@mui/icons-material';
import HomeList from '~/Components/HomeList';
import HomeProjectList from '~/Components/HomeProjectList';
import HomeProflieList from '~/Components/HomeProflieList';


const Home = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: '#4a4a4a', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>Home</Typography>

      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="body1" sx={{ color: '#aaa' }}>Saturday, October 5</Typography>

        <Typography variant="h3" sx={{ color: 'white' }}>Good afternoon, Luyện</Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Chip
            label="My month"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', mr: 1 }}
          />
          <Chip
            icon={<span style={{ color: 'white' }}>✓</span>}
            label="0 tasks completed"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white', mr: 1 }}
          />
          <Chip
            icon={<span style={{ color: 'white' }}>👥</span>}
            label="0 collaborators"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2, backgroundColor: '#333', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 1 }}>L</Avatar>
          <Typography variant="h6">My tasks</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: 'white' }}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
        <HomeList />
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Box sx={{ flexBasis: '60%' }}>
          <HomeProjectList />
        </Box>
        <Box sx={{ flexBasis: '50%' }}>
          <HomeProflieList />
        </Box>
      </Box>


    </Box>
  );
};

export default Home;