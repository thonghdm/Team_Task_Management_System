import React, { useState, useRef, useEffect } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { FormatterTimeAgo } from '~/utils/FormatterTimeAgo';
import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

import { editComment } from '~/redux/project/comment-slice';
import { fetchTaskById } from '~/redux/project/task-slice';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';


const Comment = ({ img, author, content, id, timestamp, commentID, taskId }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { userData, accesstoken } = useSelector(state => state.auth)
  const { projectId } = useParams();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


  ///
  const refreshToken = useRefreshToken();
  const dispatch = useDispatch();
  const handleClose = () => {
    setAnchorEl(null);
  };

  ///
  const handleDelete = async () => {
    const commentData = {
      _id: commentID,
      is_active: false,
    };
    const editComments = async (token) => {
      try {
        const resultAction = await dispatch(editComment({ accesstoken: token, data: commentData }));

        if (editComment.rejected.match(resultAction)) {
          if (resultAction.payload?.err === 2) {
            const newToken = await refreshToken();
            return editComments(newToken);
          }
          throw new Error('Comment edit failed');
        }
        await dispatch(fetchTaskById({ accesstoken: token, taskId }));
        await dispatch(fetchProjectDetail({ accesstoken:token, projectId }));
        toast.success('Comment delete successfully!');
      } catch (error) {
        throw error;
      }
    };
    editComments(accesstoken);
    setAnchorEl(null);
  };


  return (
    <Box sx={{ display: 'flex', mb: 2, color: 'white' }}>
      <Avatar src={img} sx={{ bgcolor: '#e34935', width: 30, height: 30, fontSize: '0.8rem', mr: 1 }}>
        {author.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: '8px',
        padding: 2,
        width: '100%',
        padding: "8px!important",
        color: theme.palette.text.primary
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mr: 1 }}>
            {author}
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
            {/* {relativeTime} */}
            {FormatterTimeAgo(timestamp)}
          </Typography>
          {userData._id === id && (<IconButton
            size="small"
            sx={{ color: theme.palette.text.primary, ml: 'auto' }}
            onClick={handleClick}
          >
            <MoreHoriz fontSize="small" />
          </IconButton>)}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
        <ProjectDescription initialContent={content} context={"comment"} commentID={commentID} taskId={taskId} />
      </Box>
    </Box>
  );
};

const CommentList = ({ comments, taskId }) => {
  return (
    <Box sx={{ mt: 1 }}>
      {[...comments]?.reverse().map((comment, index) => (
        <Comment
          key={`${comment?._id}-${index}`}
          img={comment?.user_id?.image}
          author={comment?.user_id?.displayName}
          content={comment?.content}
          id={comment?.user_id?._id}
          commentID={comment?._id}
          timestamp={new Date(comment?.createdAt).toLocaleString()}
          taskId={taskId}
        />
      ))}
    </Box>
  );
};

export default CommentList;