import React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { Box, ToggleButtonGroup, ToggleButton,Typography } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function ModeSelect() {
  const { mode, setMode } = useColorScheme();

  const handleChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Box sx={{ m: 2 }}>
    {/* <Typography>Theme</Typography> */}
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        aria-label="mode selection"
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '10px',
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            '&:not(:first-of-type)': {
              borderRadius: '8px',
            },
            '&:first-of-type': {
              borderRadius: '8px',
            },
          },
        }}
      >
        <ToggleButton value="light" aria-label="light mode" sx={{fontSize: '13px'}}>
          <LightModeIcon sx={{ fontSize: 16 , mr: 1 }} />
          Light
        </ToggleButton>
        <ToggleButton value="system" aria-label="system mode" sx={{fontSize: '13px'}}>
          <SettingsBrightnessIcon sx={{fontSize: 16, mr: 1 }} />
          System
        </ToggleButton>
        <ToggleButton value="dark" aria-label="dark mode" sx={{fontSize: '13px'}}>
          <DarkModeIcon sx={{ fontSize: 16,mr: 1 }} />
          Dark
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

export default ModeSelect;
