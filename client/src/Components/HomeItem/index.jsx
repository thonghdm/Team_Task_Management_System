import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTheme } from '@mui/material/styles';
import { formatDateRange } from '~/utils/formatDateRange'
const HomeItem = ({ task, project, startDate, endDate, color, status }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pb: 1 }}>
      <CheckCircleOutlineIcon sx={{ color: color, mr: 2 }} />
      <Typography sx={{ flexGrow: 1 }}>{task}</Typography>
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor:
            status === 'To Do' ? '#ff0000' :
              status === 'Completed' ? '#6aa84f' :
                status === 'In Progress' ? '#ffeb3b' :
                  '#6aa84f', // default color
          color: theme.palette.text.primary,
          mr: 2
        }}
      />
      <Chip
        label={project}
        size="small"
        sx={{ backgroundColor:"#5dade2", color: theme.palette.text.primary, mr: 2 }} />
      <Typography
        variant="body2"
        sx={{ color: color, mr: 2 }}>
        {formatDateRange(startDate, endDate)}
      </Typography>
    </Box>
  );
};

export default HomeItem;
