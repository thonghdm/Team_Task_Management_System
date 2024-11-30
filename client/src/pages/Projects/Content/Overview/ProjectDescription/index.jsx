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

import 'react-quill/dist/quill.snow.css';

import { updateTaskThunks } from '~/redux/project/task-slice';
import { updateProjectThunk } from '~/redux/project/project-slice';
import { createAuditLog } from '~/redux/project/auditLog-slice';

import { updateAll } from '~/apis/User/userService'
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
const ProjectDescription = ({ initialContent, isEditable = true, isLabled = true, context, taskId = null, commentID = "" }) => {
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
    setContent(initialContent);
    setTempContent(initialContent);
  }, [initialContent]);

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
              await dispatch(createAuditLog({
                accesstoken: token,
                data: {
                  task_id: taskId,
                  action: 'Create',
                  entity: 'Comment',
                  old_value: null,
                  new_value: tempContent,
                  user_id: userData?._id
                }
              }));
              await dispatch(fetchTaskById({ accesstoken: token, taskId }));
              await dispatch(createAuditLog_project({
                accesstoken: token,
                data: {
                  project_id: projectId,
                  action: 'Update',
                  entity: 'Task',
                  user_id: userData?._id,
                  task_id: taskId,
                }
              }))
              await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
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
              await dispatch(createAuditLog({ 
                accesstoken: token, 
                data: { task_id: taskId, 
                        action:'Update', 
                        entity:'Comment', 
                        old_value: content,
                        new_value: tempContent,
                        user_id:userData?._id} }));
              await dispatch(fetchTaskById({ accesstoken: token, taskId }));
              await dispatch(createAuditLog_project({
                accesstoken: token,
                data: {
                  project_id: projectId,
                  action: 'Update',
                  entity: 'Task',
                  user_id: userData?._id,
                  task_id: taskId,
                }}))
              await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
              setContent(tempContent);
              setIsEditing(false);

            } catch (error) {
              throw error;
            }
          };
          await editComments(accesstoken);
        }

      }
      else if (context === "descriptionTask") {
        try {
          if (!tempContent || (content === initialContent && tempContent === initialContent)) {
            setIsEditing(false);
            return;
          }
          const dataSave = {
            description: tempContent
          };
          const handleSuccess = () => {
            toast.success('Update description task successfully!');
            setContent(tempContent);
            setIsEditing(false);
          };
          const saveDescriptionTask = async (token) => {
            try {
              const resultAction = await dispatch(updateTaskThunks({
                accesstoken: token,
                taskId: taskId,
                taskData: dataSave
              }));
              if (updateTaskThunks.rejected.match(resultAction)) {
                if (resultAction.payload?.err === 2) {
                  const newToken = await refreshToken();
                  return saveDescriptionTask(newToken);
                }
                throw new Error('Update description task failed');
              }
              await dispatch(createAuditLog({ 
                accesstoken: token, 
                data: { task_id: taskId, 
                        action:'Update', 
                        entity:'Description', 
                        old_value: content,
                        user_id:userData?._id} }));
              await dispatch(fetchTaskById({ accesstoken: token, taskId }));
              await dispatch(createAuditLog_project({
                accesstoken: token,
                data: {
                  project_id: projectId,
                  action: 'Update',
                  entity: 'Task',
                  user_id: userData?._id,
                  task_id: taskId,
                }}))
              await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
              handleSuccess();
            } catch (error) {
              throw error;
            }
          };
          saveDescriptionTask(accesstoken);
        }
        catch (error) {
          throw error;
        }
      }
      else if (context === "descriptionProject") {
        try {
          if (!tempContent || (content === initialContent && tempContent === initialContent)) {
            setIsEditing(false);
            return;
          }
          const dataSave = {
            description: tempContent
          };
          const handleSuccess = () => {
            toast.success('Update description project successfully!');
            setContent(tempContent);
            setIsEditing(false);
          };
          const saveDescriptionProject = async (token) => {
            try {
              const resultAction = await dispatch(updateProjectThunk({
                accesstoken: token,
                projectId: projectId,
                projectData: dataSave
              }));
              if (updateProjectThunk.rejected.match(resultAction)) {
                if (resultAction.payload?.err === 2) {
                  const newToken = await refreshToken();
                  return saveDescriptionProject(newToken);
                }
                throw new Error('Update description project failed');
              }
              await dispatch(createAuditLog_project({
                accesstoken: token,
                data: {
                  project_id: projectId,
                  action: 'Update',
                  entity: 'Description',
                  user_id: userData?._id,
                }}))
              await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
              handleSuccess();
            } catch (error) {
              throw error;
            }
          };
          saveDescriptionProject(accesstoken);
        }
        catch (error) {
          throw error;
        }
      }
      else if (context === "descriptionMyTask") {
        try {
          if (!tempContent || (content === initialContent && tempContent === initialContent)) {
            setIsEditing(false);
            return;
          }
          const data = {
            note: tempContent,
            _id: userData._id
          };
          const handleSuccess = () => {
            toast.success('Update note successfully!');
            setContent(tempContent);
            setIsEditing(false);
          };

          const saveNote = async (token) => {
            try {
              const response = await updateAll(token, data);
              handleSuccess();
              dispatch({
                type: actionTypes.USER_UPDATE_SUCCESS,
                data: { userData: response.data.response },
              });
              
            } catch (error) {
              if (error.response?.status === 401) {
                const newToken = await refreshToken();
                return saveNote(newToken);
              } throw new Error('Update note failed');
            }
          };
          saveNote(accesstoken);
        }
        catch (error) {
          throw error;
        }

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
        <div
          style={{ border: 'none' }}
        >
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{ __html: content }}
            onClick={() => { if (isEditable) setIsEditing(true) }}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;