import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Select, MenuItem } from '@mui/material';
import { Assignment, Code } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import GppBadIcon from '@mui/icons-material/GppBad';


const StatItem = ({ icon: Icon, value, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt:3 }}>
    <Icon sx={{ mr: 1, color: 'text.secondary' }} />
    <Box>
      <Typography variant="h6" component="div">{value}</Typography>
      <Typography sx={{ fontSize:12}} color="text.secondary">{label}</Typography>
    </Box>
  </Box>
);

const ProjectStats = () => {
  const theme = useTheme();
  const [period, setPeriod] = useState('last7days');

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h6" component="div">
          Project stats
        </Typography>
        <Select
          value={period}
          onChange={handlePeriodChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="last7days">Last 7 days</MenuItem>
          <MenuItem value="last30days">Last 30 days</MenuItem>
          <MenuItem value="last3months">Last 3 months</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatItem icon={NoteAddIcon} value={121} label="Work items created" />
        </Grid>
        <Grid item xs={6}>
          <StatItem icon={AssignmentTurnedInIcon} value={37} label="Work items completed" />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <StatItem icon={GppBadIcon} value={121} label="Work items cancel" />
        </Grid>
        <Grid item xs={6}>
          <StatItem icon={Assignment} value={37} label="Work items completed" />
        </Grid>
      </Grid>
    </>
  );
};

export default ProjectStats;