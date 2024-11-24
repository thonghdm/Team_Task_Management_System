import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material';

const StatusSelector = ({ value, onChange, title="Status" }) => {
  const [status, setStatus] = useState(value || 'To Do');
  const theme = useTheme();

  useEffect(() => {
    setStatus(value || 'To Do');
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setStatus(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const getStatusColor = (level) => {
    switch (level) {
      case 'To Do':
        return '#ff6e6e';
      case 'In Progress':
        return '#FFB84D';
      case 'Completed':
        return '#4CAF50';
      default:
        return '#FFB84D';
    }
  };

  const statusStyles = {
    select: {
      backgroundColor: 'transparent',
      color: getStatusColor(status),
      border: `1px solid ${theme.palette.text.secondary}`,
      borderRadius: '16px',
      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
      minWidth: '120px',
      height: '32px'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
    },
    statusChip: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.875rem',
      fontWeight: 500
    }
  };

  const renderStatusOption = (level) => (
    <Box
      sx={{
        ...statusStyles.statusChip,
        backgroundColor: `${getStatusColor(level)}20`,
        color: getStatusColor(level)
      }}
    >
      {level}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ width: '100px', color: 'text.primary' }}>{title}</Typography>
      <Select
        value={status}
        onChange={handleChange}
        sx={statusStyles.select}
        variant="outlined"
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              borderRadius: '8px',
              marginTop: '4px'
            }
          }
        }}
      >
        <MenuItem value="To Do" sx={statusStyles.menuItem}>
          {renderStatusOption('To Do')}
        </MenuItem>
        <MenuItem value="In Progress" sx={statusStyles.menuItem}>
          {renderStatusOption('In Progress')}
        </MenuItem>
        <MenuItem value="Completed" sx={statusStyles.menuItem}>
          {renderStatusOption('Completed')}
        </MenuItem>
      </Select>
    </Box>
  );
};

export default React.memo(StatusSelector);
