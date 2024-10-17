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

const colors = [
  '#1a5fb4', '#26a269', '#e66100', '#a51d2d', '#613583',
  '#2ec27e', '#e5a50a', '#ff7800', '#f66151', '#9141ac',
  '#33d17a', '#f8e45c', '#ff9e00', '#dc8add', '#c061cb',
  '#3584e4', '#8ff0a4', '#ffa348', '#f778ba', '#b5835a',
  '#62a0ea', '#99c1f1', '#f9f06b', '#ffbe6f', '#cdab8f',
  '#641e16 ', '#512e5f', '#154360', '#0e6251', '#145a32',
  '#7d6608', '#784212'
];

const ColorPickerDialog = ({ open, onClose }) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [title, setTitle] = useState('');
  const theme = useTheme();

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleClose = () => {
    onClose(selectedColor, title);
  };

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
        <Button onClick={() => setSelectedColor('')} sx={{ color: theme.palette.text.secondary }}>
          Remove color
        </Button>
        <Button onClick={handleClose} variant="contained" color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPickerDialog;