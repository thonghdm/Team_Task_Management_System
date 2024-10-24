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
import { Close, InsertDriveFile } from '@mui/icons-material';

const FileUploadDialog = ({ open, onClose }) => {
  const [link, setLink] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInsert = () => {
    // Handle the insert action here
    onClose();
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