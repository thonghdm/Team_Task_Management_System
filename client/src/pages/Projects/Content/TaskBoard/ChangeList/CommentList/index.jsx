import React from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const Comment = ({img, author, content, timestamp }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', mb: 2, color: 'white' }}>
      <Avatar src={img} sx={{ bgcolor: '#e34935', width: 30, height: 30, fontSize: '0.8rem', mr: 1 }}>
        {author.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{
        backgroundColor:  theme.palette.background.default, // Màu nền (tùy chỉnh theo yêu cầu)
        borderRadius: '8px',        // Bo góc viền
        padding: 2,                 // Thêm khoảng cách giữa nội dung và viền
        width: '100%',
        padding: "8px!important" ,
        color: theme.palette.text.primary            // Chiều rộng
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
            {author}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {timestamp}
          </Typography>
          <IconButton
            size="small"
            sx={{ color: theme.palette.text.primary, ml: 'auto' }}
            onClick={handleClick}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Edit</MenuItem>
            <MenuItem onClick={handleClose}>Delete</MenuItem>
          </Menu>
        </Box>
        <Typography variant="body2">{content}</Typography>
      </Box>
    </Box>
  );
};

const CommentList = ({ comments }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment} />
      ))}
    </Box>
  );
};

export default CommentList;