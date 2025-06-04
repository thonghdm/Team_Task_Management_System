import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material';

const StatsCard = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  icon1,
  color = 'primary.main', 
  background,
  gradient,
  iconBg,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        background: gradient || background,
        color: 'white',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
        ...sx
      }}
    >
      <CardContent>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="flex-start"
        >
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                opacity: 0.8, 
                textTransform: 'uppercase', 
                letterSpacing: '1px',
                mb: 1
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold',
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              {value}
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                opacity: 0.9
              }}
            >
              {icon1}
              <Typography 
                variant="body2" 
                sx={{ 
                  ml: 1,
                  fontWeight: 500
                }}
              >
                {subtext}
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              color: 'white',
              opacity: 0.8,
              backgroundColor: iconBg,
              padding: 1,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1) rotate(5deg)',
                opacity: 1
              }
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;