import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRefreshToken } from '~/utils/useRefreshToken'
import { fetchFileByIdTask, updateFileByIdTaskThunk } from '~/redux/project/uploadFile-slice';
import { useDispatch, useSelector } from 'react-redux'
import { createAuditLog } from '~/redux/project/auditlog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import { fetchTaskById } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
import { useParams } from 'react-router-dom';
import { addNotification } from '~/redux/project/notifications-slice/index';
import { validateProjectFile } from '~/utils/fileValidation';

const FileUploadDialog = ({ open, onClose, taskId, entityType, isClickable = true, members, task }) => {
  const [link, setLink] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [file, setFile] = useState(null);
  const { projectId } = useParams();
  const [isUploading, setIsUploading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    // Validate file before setting it
    const validation = validateProjectFile(selectedFile);
    if (!validation.isValid) {
      // Reset file input on validation failure
      event.target.value = '';
      setFile(null);
      setIsDisabled(true);
      return;
    }
    setFile(selectedFile);
    setIsDisabled(false);
  };

  ////////////////////////////////
  const refreshToken = useRefreshToken();
  const dispatch = useDispatch();
  const { accesstoken, userData } = useSelector(state => state.auth)

  const handleInsert = () => {
    try {
      if (!file) {
        toast.error("File is required");
        return;
      }
      
      // Double-check file validation before upload
      const validation = validateProjectFile(file);
      if (!validation.isValid) {
        setFile(null);
        setIsDisabled(true);
        return;
      }

      if (!isClickable) {
        toast.error("You don't have permission to upload file");
        return;
      }

      const fileData = {
        file: file,
        entityId: taskId,
        entityType: entityType,
        uploadedBy: userData?._id
      };

      const notificationData = task?.assigned_to_id
        .filter(member =>
          member.memberId._id !== userData._id &&
          members.members.some(m =>
            m.memberId._id === member.memberId._id &&
            m.is_active === true
          )
        )
        .map(member => ({
          senderId: userData._id,
          receiverId: member.memberId._id,
          projectId: projectId,
          taskId: taskId,
          type: 'task_update',
          message: `${userData.displayName} has uploaded file "${file.name}" to task ${task?.task_name} in project ${task?.project_id?.projectName}`
        }));

      const uploadFileTask = async (token) => {
        try {
          setIsUploading(true);
          setIsDisabled(true);
          
          const resultAction = await dispatch(updateFileByIdTaskThunk({ accesstoken: token, file: fileData }));
          if (updateFileByIdTaskThunk.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return uploadFileTask(newToken);
            }
            throw new Error('File upload failed');
          }
          
          await dispatch(createAuditLog({
            accesstoken: token,
            data: {
              task_id: taskId,
              action: 'Create',
              entity: 'Attachment',
              user_id: userData?._id,
              old_value: fileData?.file?.name
            }
          }));
          
          const tastData = await dispatch(fetchTaskById({ accesstoken: token, taskId }));
          await dispatch(fetchFileByIdTask({ accesstoken: token, taskId }));
          await dispatch(createAuditLog_project({
            accesstoken: token,
            data: {
              project_id: tastData?.payload?.project_id?._id,
              action: 'Update',
              entity: 'Task',
              user_id: userData?._id,
              task_id: taskId,
            }
          }))
          
          if (projectId) await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
          await dispatch(addNotification({ accesstoken: token, data: notificationData }));
          
          toast.success(`File "${file.name}" uploaded successfully`);
          setLink('');
          setDisplayText('');
          setFile(null);
          onClose();
          
        } catch (error) {
          toast.error(`Failed to upload file: ${error.message}`);
          throw error;
        }
        finally {
          setIsUploading(false);
          setIsDisabled(false);
        }
      };
      
      uploadFileTask(accesstoken);
    } catch (error) {
      toast.error('An error occurred during file upload');
    } 
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Attach
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
          disabled={isUploading}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Attach a file from your computer
        </Typography>

        <Typography variant="body2" color="textSecondary" gutterBottom>
          You can also drag and drop files to upload them.
        </Typography>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{ mt: 1, mb: 2, bgcolor: 'action.selected', color: 'text.primary' }}
          disabled={isUploading}
        >
          Choose a file
          <input type="file" hidden onChange={handleFileChange}  />
        </Button>
        {file && <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
          {file?.name}
        </Typography>}
        {/* <TextField
          fullWidth
          placeholder="Find recent links or paste a new link"
          variant="outlined"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          placeholder="Text to display"
          variant="outlined"
          value={displayText}
          onChange={(e) => setDisplayText(e.target.value)}
          sx={{ mb: 2 }}
        /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUploading}>Cancel </Button>
        <Button onClick={handleInsert} variant="contained" color="primary" disabled={isDisabled}>
            {isUploading ? 'Uploading...' : 'Insert'}
            {isUploading && <CircularProgress size={20} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;