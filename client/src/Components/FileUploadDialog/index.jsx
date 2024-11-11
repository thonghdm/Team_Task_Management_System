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
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { useRefreshToken } from '~/utils/useRefreshToken'
import { fetchFileByIdTask, updateFileByIdTaskThunk } from '~/redux/project/uploadFile-slice';
import { useDispatch, useSelector } from 'react-redux'

const FileUploadDialog = ({ open, onClose, taskId, entityType }) => {
  const [link, setLink] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
      const fileData = {
        file: file,
        entityId: taskId,
        entityType: entityType,
        uploadedBy: userData?._id
      };
      const uploadFileTask = async (token) => {
        try {
          const resultAction = await dispatch(updateFileByIdTaskThunk({ accesstoken: token, file: fileData }));
          if (updateFileByIdTaskThunk.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return uploadFileTask(newToken);
            }
            throw new Error('File upload failed');
          }
          await dispatch(fetchFileByIdTask({ accesstoken: token, taskId }));
          toast.success("File upload successfully");
          onClose();
        } catch (error) {
          throw error; // Rethrow error nếu không phải error code 2
        }
      };
      uploadFileTask(accesstoken);
    } catch (error) {
      throw error;
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
        >
          Choose a file
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && <Typography sx={{ mb: 2 }} variant="body2" gutterBottom>
          {file?.name}
        </Typography>}
        <TextField
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleInsert} variant="contained" color="primary">
          Insert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;