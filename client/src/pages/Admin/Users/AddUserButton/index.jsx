import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
const AddUserButton = ({ initialUser }) => {
  const [user, setUser] = useState(initialUser || {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });


  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setUserData({ name: '', email: '', password: '' });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Card sx={{
      margin: 3,
      mt: "90px"
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CardHeader
          title="Add User"
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.5rem',
              fontWeight: 600,
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            mr:2
          }}
        >
          Add User File
        </Button>
      </Box>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Điệp Thảo"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Nguyễn Văn"
            variant="outlined"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            placeholder="diepthaonguyenvanbmt@gmail.com"
            variant="outlined"
            margin="normal"
          />


          <TextField
            fullWidth
            label="ConfirmPassword"
            name="confirmPassword"
            type="confirmPassword"
            value={user.confirmPassword}
            onChange={handleChange}
            placeholder="diepthaonguyenvanbmt@gmail.com"
            variant="outlined"
            margin="normal"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          variant="outlined"
        //   onClick={onCancel}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
};

export default AddUserButton;