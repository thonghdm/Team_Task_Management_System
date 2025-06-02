import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const TaskReview = ({ role, taskReview, status, onAccept, onReject }) => {
  if (taskReview === 'not requested') {
    return null;
  }
  // Nếu là Project Manager và task đã hoàn thành, hiển thị nút Accept/Reject
  if (role === 'ProjectManager' && status === 'Completed' && taskReview === 'pending') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button 
          variant="contained" 
          color="success" 
          size="small" 
          onClick={() => onAccept && onAccept()}
        >
          Accept
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          size="small" 
          onClick={() => onReject && onReject()}
        >
          Reject
        </Button>
      </Box>
    );
  }
  const colorMap = {
    pending: { bg: 'rgba(255, 215, 0, 0.2)', text: '#f1c40f', label: 'Pending' },
    accept: { bg: 'rgba(76, 175, 80, 0.2)', text: '#2e7d32', label: 'Accepted' },
    reject: { bg: 'rgba(244, 67, 54, 0.2)', text: '#c62828', label: 'Rejected' },
  };
  const { bg, text, label } = colorMap[taskReview] || {};
  // Nếu không phải PM hoặc task chưa hoàn thành, hiển thị trạng thái
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        display: 'inline-block',
        bgcolor:bg
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 600,
          color: text
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default TaskReview; 