import React, { useState, useRef, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import TextEditor from '~/Components/TextEditor';
import "./styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useParams } from 'react-router-dom';

import { createComment, editComment } from '~/redux/project/comment-slice';
import { fetchTaskById } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';

const ProjectDescription = ({ initialContent, isEditable = true, isLabled = true, context, taskId=null, commentID = "" }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [tempContent, setTempContent] = useState(initialContent); // temporary content for editing
  const editorRef = useRef(null);
  const { projectId } = useParams();

  const { userData, accesstoken } = useSelector(state => state.auth)

  const handleClickOutside = (event) => {
    if (editorRef.current && !editorRef.current.contains(event.target)) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const refreshToken = useRefreshToken();

  ///
  ///
  const handleSave = async () => {
    // setContent(tempContent);
    // setIsEditing(false);
    // console.log("handleSave", tempContent, "a", content);
    try {
      if (context === "comment") {
        if (content === "Write a comment") {
          if (!tempContent || (content === initialContent && tempContent === initialContent)) {
            setIsEditing(false);
            return;
          }
          const commentData = {
            task_id: taskId,
            user_id: userData._id,
            content: tempContent,
          }
          const createComments = async (token) => {
            try {
              const resultAction = await dispatch(createComment({ accesstoken: token, data: commentData }));
              if (createComment.rejected.match(resultAction)) {
                if (resultAction.payload?.err === 2) {
                  const newToken = await refreshToken();
                  return createComments(newToken);
                }
                throw new Error('Comment creation failed');
              }
              await dispatch(fetchTaskById({ accesstoken: token, taskId }));
              await dispatch(fetchProjectDetail({ accesstoken:token, projectId }));
              setIsEditing(false);
            } catch (error) {
              throw error; // Rethrow error nếu không phải error code 2
            }
          };
          await createComments(accesstoken);
        } else {
          const commentData = {
            _id: commentID,
            content: tempContent,
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
              setContent(tempContent);
              setIsEditing(false);

            } catch (error) {
              throw error;
            }
          };
          await editComments(accesstoken);
        }

      }
      else if (context === "description") {
        console.log("description");
      }
    } catch (error) {
    console.error('Error in handleSave:', error);
    }
  };

  const handleCancel = () => {
    setTempContent(content); // Revert changes
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div ref={editorRef}>
          <TextEditor value={isLabled ? tempContent : ""} onChange={setTempContent} />
          <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </div>
      ) : (
        <Typography
          variant="body1"
          className="no-margin"
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={() => { if (isEditable) setIsEditing(true) }}
        />
      )}
    </div>
  );
};

export default ProjectDescription;