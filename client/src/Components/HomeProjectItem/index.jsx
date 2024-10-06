import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HomeProjectItem = ({ icon, title, subtitle, color, onClick }) => {
  const theme = useTheme();

  return (
    <Button
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        width: '100%',
        justifyContent: 'flex-start',
        textTransform: 'none',
        padding: 1,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2,
          border: `1px dotted ${theme.palette.text.primary}`
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
          {title.length > 18 ? `${title.substring(0, 18)}...` : title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: theme.palette.grey[100] }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Button>
  );
}

export default HomeProjectItem;
