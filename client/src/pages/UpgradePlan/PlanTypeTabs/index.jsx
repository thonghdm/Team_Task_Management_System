// PlanTypeTabs.jsx
import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';

const PlanTypeTabs = ({ tabValue, handleTabChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      {/* <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        sx={{ 
          '& .MuiTabs-indicator': { 
            display: 'none' 
          },
          '& .MuiTab-root': { 
            borderRadius: '20px',
            mx: 0.5,
            minHeight: '32px',
            py: 0.5,
            px: 2
          },
          '& .Mui-selected': {
            backgroundColor: 'rgba(0, 0, 0, 0.08)'
          },
          bgcolor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '20px',
          p: 0.5
        }}
      >
        <Tab label="Personal" />
        <Tab label="Business" />
      </Tabs> */}
    </Box>
  );
};

export default PlanTypeTabs;