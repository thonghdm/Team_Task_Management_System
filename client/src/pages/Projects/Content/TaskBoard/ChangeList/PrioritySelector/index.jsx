import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material';
const PrioritySelector = ({ value, onChange, isClickable = true }) => {
  const [priority, setPriority] = useState(value || 'Medium');
  const theme = useTheme();
  useEffect(() => {
    setPriority(value || 'Medium');
  }, [value]);
  
  const handleChange = (event) => {
    const newValue = event.target.value;
    setPriority(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (!isClickable) setPriority(value);
  };

  const getPriorityColor = (level) => {
    switch (level) {
      case 'Low':
        return '#4CD2C0';  // Turquoise
      case 'Medium':
        return '#FFB84D';  // Orange
      case 'High':
        return '#E587FF';  // Purple
      default:
        return '#FFB84D';  // Default to Medium color
    }
  };

  const priorityStyles = {
    select: {
      backgroundColor: 'transparent',
      color: getPriorityColor(priority),
      border: `1px solid ${theme.palette.text.secondary}`,
      borderRadius: '16px',
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none'
      },
      minWidth: '120px',
      height: '32px'
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
      }
    },
    priorityChip: {
      padding: '4px 8px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: 500
    }
  };

  const renderPriorityOption = (level) => {
    return (
      <Box
        sx={{
          ...priorityStyles.priorityChip,
          backgroundColor: `${getPriorityColor(level)}20`,
          color: getPriorityColor(level)
        }}
      >
        {level}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography sx={{ width: '100px', color: 'text.primary' }}>
        Priority
      </Typography>
      <Select
        value={priority}
        onChange={handleChange}
        sx={priorityStyles.select}
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
        <MenuItem value="Low" sx={priorityStyles.menuItem}>
          {renderPriorityOption('Low')}
        </MenuItem>
        <MenuItem value="Medium" sx={priorityStyles.menuItem}>
          {renderPriorityOption('Medium')}
        </MenuItem>
        <MenuItem value="High" sx={priorityStyles.menuItem}>
          {renderPriorityOption('High')}
        </MenuItem>
      </Select>
    </Box>
  );
};

export default PrioritySelector;