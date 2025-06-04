import React, { useEffect, useRef } from 'react';
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
// Import ringtone directly
const ringtone = 'https://storage.googleapis.com/team-task-management-files/%24RLSKBQ7.mp3'

const CallNotification = ({ 
  open = false, 
  caller, 
  onAccept, 
  onDecline, 
  isProcessing = false 
}) => {
  // If the component is called without an explicit open prop, default to false
  const isOpen = open === true;
  const audioRef = useRef(null);

  // Handle ringtone and auto-close
  useEffect(() => {
    if (isOpen) {
      // Create and play sound when receiving a call
      audioRef.current = new Audio(ringtone);
      audioRef.current.volume = 0.5; // Set volume to 50%
      audioRef.current.loop = true; // Loop the sound
      
      // Add more detailed error handling
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Ringtone is playing');
          })
          .catch(error => {
            console.error('Error playing ringtone:', error);
            // Try playing again if there's an error
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play().catch(err => console.error('Error playing ringtone (retry):', err));
              }
            }, 1000);
          });
      }

      // Auto stop sound and close dialog after 20 seconds
      const timeoutId = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        // Auto decline call after 20 seconds
        onDecline();
      }, 20000);

      // Cleanup function
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, onDecline]); // Add onDecline to dependencies

  // Stop sound when dialog closes
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen]);

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
        Incoming Call
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
          is calling you...
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
          Decline
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
            'Accept'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallNotification;
