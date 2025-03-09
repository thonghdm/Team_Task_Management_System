import React from 'react';
import { Box, Avatar, Typography, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';
import WidthFullIcon from '@mui/icons-material/WidthFull'; import AddIcon from '@mui/icons-material/Add';
import ReportIcon from '@mui/icons-material/Report';
import { useTheme } from '@mui/material/styles';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';

const ChatHeader = ({ toggleSidebar }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        borderBottom: '1px solid #ddd',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="h6"></Typography>
      </Box>
      <Box>
        {/* <IconButton sx={{ mr: 1 }}>
          <AddIcon />
        </IconButton> */}
        <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
          <RotateLeftIcon />
        </IconButton>
        {/* <IconButton onClick={toggleSidebar}>
          <WidthFullIcon />
        </IconButton> */}
      </Box>
    </Box>
  );
};

export default ChatHeader;
