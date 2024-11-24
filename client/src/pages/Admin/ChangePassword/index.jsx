import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';

import { useTheme } from '@mui/material';

const ChangePassword = ({ initialUser }) => {
  const theme = useTheme();
  const [user, setUser] = useState(initialUser || {
    password: '',
    confirmPassword: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form logic
  };

  return (
    <Card
      sx={{
        margin: 3,
        mt: '90px',
        boxShadow: theme.shadows[4],
        borderRadius: '12px',
      }}
    >
      <CardHeader
        title="Edit User"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: '1.75rem',
            fontWeight: 700,
            color: theme.palette.primary.main,
          },
          paddingBottom: 0,
          textAlign: 'center',
        }}
      />
      <Divider />
      <Grid container spacing={2} sx={{ padding: 3 }}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            alt="User Profile"
            sx={{
              width: 150,
              height: 150,
              bgcolor: theme.palette.primary.light,
              mt: 2,
              mb: 2,
              fontSize: '2rem',
              fontWeight: 600,
              color: theme.palette.primary.contrastText,
            }}
          >
            DP
          </Avatar>
          <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary }}>
            {/* User Name */}
            John Doe
          </Typography>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="avatar-upload"
            type="file"
          // onChange={handleAvatarChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="outlined"
              component="span"
              sx={{
                mt: 1,
                borderRadius: '8px',
                textTransform: 'none',
                color: theme.palette.secondary.main,
                borderColor: theme.palette.secondary.main,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.light,
                  borderColor: theme.palette.secondary.dark,
                },
              }}
            >
              Change Avatar
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} sm={8}>
          <CardContent>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                variant="outlined"
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                placeholder="Enter new password"
                variant="outlined"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter new password"
                variant="outlined"
                margin="normal"
              />
            </Box>
          </CardContent>
        </Grid>
      </Grid>
      <Divider />
      <CardActions
        sx={{
          justifyContent: 'flex-end',
          padding: 2
        }}
      >
        <Button
          variant="outlined"
          sx={{
            mr: 1,
            textTransform: 'none',
            borderRadius: '8px',
          }}
        // onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
          }}
          onClick={handleSubmit}
        >
          Update
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChangePassword;
