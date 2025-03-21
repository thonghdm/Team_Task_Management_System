// PlanCard.jsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';

const PlanCard = ({ 
  plan, 
  isSelected, 
  onSelect, 
  onSubscribe, 
  isPopular, 
  isCurrent,
  processingSubscription
}) => {
  const { subscription_type, price, description, features } = plan;
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={isSelected ? 3 : 1} 
      sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: isSelected ? '2px solid #1db954' : 'none',
        position: 'relative',
        backgroundColor: isSelected ? theme.palette.background.default : theme.palette.background.paper
      }}
    >
      {isPopular && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            backgroundColor: '#1db954', 
            color: 'white',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          POPULAR
        </Box>
      )}
      
      {isCurrent && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: isPopular ? 40 : 10, 
            right: 10, 
            backgroundColor: theme.palette.primary.main, 
            color: 'white',
            fontSize: '12px',
            padding: '2px 8px',
            borderRadius: '4px'
          }}
        >
          CURRENT PLAN
        </Box>
      )}
      
      <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
        {subscription_type}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
        <Typography variant="h3" component="span" sx={{ fontWeight: 'bold' }}>
          ${price}
        </Typography>
        <Typography variant="subtitle1" component="span" sx={{ ml: 1 }}>
          USD/month
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {description}
      </Typography>
      
      <Button 
        variant={isCurrent ? "contained" : "outlined"} 
        color="primary" 
        fullWidth 
        onClick={isCurrent ? onSelect : onSubscribe}
        disabled={processingSubscription || isCurrent}
        sx={{ 
          mb: 3, 
          backgroundColor: isCurrent ? '#1db954' : 'transparent',
          '&:hover': {
            backgroundColor: isCurrent ? '#19a34a' : 'rgba(29, 185, 84, 0.08)'
          }
        }}
      >
        {processingSubscription ? (
          <CircularProgress size={24} color="inherit" />
        ) : isCurrent ? (
          'Current Plan'
        ) : (
          `Subscribe to ${subscription_type}`
        )}
      </Button>
      
      <List>
        {features.map((feature, index) => (
          <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <CheckIcon color="success" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={feature} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PlanCard;