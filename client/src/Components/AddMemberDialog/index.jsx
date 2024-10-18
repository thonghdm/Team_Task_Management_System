import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const AddMemberDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [members] = useState([
    { id: 1, name: 'Ku Huh', initials: 'KH' },
    { id: 2, name: 'Thong', initials: 'TH' },
    { id: 3, name: 'Huy', initials: 'HU' },
    { id: 4, name: 'Thánh', initials: 'TH' },
    { id: 1, name: 'Ku Huh', initials: 'KH' },
    { id: 2, name: 'Thong', initials: 'TH' },
    { id: 3, name: 'Huy', initials: 'HU' },
    { id: 4, name: 'Thánh', initials: 'TH' },
    // Add more members as needed
  ]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    // Implement save functionality here
    console.log('Save button clicked');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Members</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          placeholder="Search members"
          fullWidth
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Board members
        </Typography>
        <List sx={{ maxHeight: 300, overflow: 'auto' }}>
          {filteredMembers.map((member) => (
            <ListItem key={member.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'orange' }}>{member.initials}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={member.name} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMemberDialog;