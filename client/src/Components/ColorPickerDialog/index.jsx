import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  TextField
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { createLabel } from '~/redux/project/label-slice';
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskById } from '~/redux/project/task-slice';
import { fetchProjectDetail } from '~/redux/project/projectDetail-slide';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useParams } from 'react-router-dom';
import { createAuditLog } from '~/redux/project/auditLog-slice';
import { createAuditLog_project } from '~/redux/project/auditlog-slice/auditlog_project';
import socket from '~/utils/socket';

const colors = [
  '#1a5fb4', '#26a269', '#e66100', '#a51d2d', '#613583',
  '#2ec27e', '#e5a50a', '#ff7800', '#f66151', '#9141ac',
  '#33d17a', '#f8e45c', '#ff9e00', '#dc8add', '#c061cb',
  '#3584e4', '#8ff0a4', '#ffa348', '#f778ba', '#b5835a',
  '#62a0ea', '#99c1f1', '#f9f06b', '#ffbe6f', '#cdab8f',
  '#641e16 ', '#512e5f', '#154360', '#0e6251', '#145a32',
  '#7d6608', '#784212'
];

const ColorPickerDialog = ({ open, onClose, taskId, isClickable = true }) => {
  const [selectedColor, setSelectedColor] = useState('#1a5fb4');
  const [title, setTitle] = useState('');
  const theme = useTheme();
  const { projectId } = useParams();

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleClose = () => {
    onClose();
    setTitle('');
    setSelectedColor('#1a5fb4');
  };

  ///
  const refreshToken = useRefreshToken();
  const dispatch = useDispatch();
  const { accesstoken, userData } = useSelector(state => state.auth)

  const handleSubmit = () => {
    try {
      if (!title) {
        toast.error("Title is required");
        return;
      }
      if (!isClickable) {
        toast.error("You don't have permission to create label");
        return;
      }
      const labelData = {
        color: selectedColor,
        task_id: taskId,
        name: title,
      }

      const createLabels = async (token) => {
        try {
          const resultAction = await dispatch(createLabel({ accesstoken: token, data: labelData }));
          if (createLabel.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return createLabels(newToken);
            }
            throw new Error('Label creation failed');
          }
          await dispatch(createAuditLog({
            accesstoken: token,
            data: {
              task_id: taskId,
              action: 'Create',
              entity: 'Label',
              old_value: labelData?.name,
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
          await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
          socket.emit('task_updated', { taskId, projectId });
          toast.success("Label created successfully");
          handleClose();
        } catch (error) {
          throw error; // Rethrow error nếu không phải error code 2
        }
      };
      createLabels(accesstoken);
    }
    catch (error) {
      throw error;
    }
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        },
      }}
      className="scrollable"
      sx={{ maxHeight: '800px!important' }}
    >
      <DialogTitle>Create label</DialogTitle>
      <DialogContent>
        <Box sx={{ width: '100%', height: 10, bgcolor: selectedColor || 'transparent', mb: 2 }} />
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={handleTitleChange}
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1" gutterBottom>
          Select a color
        </Typography>
        <Grid container spacing={1}>
          {colors.map((color) => (
            <Grid item key={color}>
              <Button
                sx={{
                  width: 42,
                  height: 40,
                  minWidth: 'unset',
                  bgcolor: color,
                  border: selectedColor === color ? '2px solid white' : 'none',
                  '&:hover': {
                    bgcolor: color,
                    opacity: 0.8,
                  },
                }}
                onClick={() => handleColorSelect(color)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPickerDialog;