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
// Import âm thanh trực tiếp
import ringtone from '../../../../assets/telephone_electronic_42654_V1.mp3';

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

  // Xử lý âm thanh thông báo và tự động đóng
  useEffect(() => {
    if (isOpen) {
      // Tạo và phát âm thanh khi có cuộc gọi đến
      audioRef.current = new Audio(ringtone);
      audioRef.current.volume = 0.5; // Đặt âm lượng 50%
      audioRef.current.loop = true; // Lặp lại âm thanh
      
      // Thêm xử lý lỗi chi tiết hơn
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Âm thanh đang phát');
          })
          .catch(error => {
            console.error('Lỗi phát âm thanh:', error);
            // Thử phát lại nếu bị lỗi
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play().catch(err => console.error('Lỗi phát âm thanh lần 2:', err));
              }
            }, 1000);
          });
      }

      // Tự động dừng âm thanh và đóng dialog sau 20 giây
      const timeoutId = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        // Tự động từ chối cuộc gọi sau 20 giây
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
  }, [isOpen, onDecline]); // Thêm onDecline vào dependencies

  // Dừng âm thanh khi đóng dialog
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
