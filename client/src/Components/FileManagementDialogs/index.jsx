import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, TextField, Typography } from '@mui/material';

const FileManagementDialogs = ({ open, onClose }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fileName, setFileName] = useState('z5935710515014_f874e20508c12bef4ce4'); // Initial file name

  const options = ['Edit','Delete'];

  const handleOptionClick = (option) => {
    if (option === 'Edit') {
      setEditOpen(true);
    } else if (option === 'Delete') {
      setDeleteOpen(true);
    }
    console.log(`Selected option: ${option}`);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteConfirm = () => {
    console.log(`File deleted: ${fileName}`);
    setDeleteOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { borderRadius: 2, padding: 2 } }}>
        <DialogContent>
          <List>
            {options.map((option) => (
              <ListItem 
                button 
                key={option} 
                onClick={() => handleOptionClick(option)} 
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemText primary={option} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: 'primary.main' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} sx={{ '& .MuiDialog-paper': { borderRadius: 2, padding: 2, minWidth: 300 } }}>
        <DialogTitle>Edit attachment</DialogTitle>
        <DialogContent>
          <TextField
            label="File name"
            fullWidth
            variant="outlined"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} sx={{ color: 'primary.main' }}>Cancel</Button>
          <Button onClick={() => { console.log(`Updated file name: ${fileName}`); handleEditClose(); }} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose} sx={{ '& .MuiDialog-paper': { borderRadius: 2, padding: 2, minWidth: 300 } }}>
        <DialogTitle>Delete attachment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this file?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} sx={{ color: 'primary.main' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileManagementDialogs;
