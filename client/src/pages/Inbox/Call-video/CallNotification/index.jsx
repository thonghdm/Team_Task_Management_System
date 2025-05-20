import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Avatar, 
  CircularProgress,
  Box
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';

const CallNotification = ({ 
  open = false, 
  caller, 
  onAccept, 
  onDecline, 
  isProcessing = false 
}) => {
  // If the component is called without an explicit open prop, default to false
  const isOpen = open === true;
  
  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        sx: {
          width: '350px',
          borderRadius: 2,
          padding: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        Cuộc gọi đến
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
        <Avatar 
          src={caller?.image}
          sx={{ width: 80, height: 80, mb: 2 }}
        >
          {caller?.displayName?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="h6" gutterBottom>
          {caller?.displayName || 'Unknown User'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          đang gọi cho bạn...
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<CallEndIcon />}
          onClick={onDecline}
          disabled={isProcessing}
        >
          Từ chối
        </Button>
        <Button 
          variant="contained" 
          color="success" 
          startIcon={isProcessing ? null : <CallIcon />}
          onClick={onAccept}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Chấp nhận'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallNotification;
