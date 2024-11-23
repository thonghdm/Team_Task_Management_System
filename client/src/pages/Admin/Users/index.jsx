import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import UserTable from '~/pages/Admin/Users/UserTable';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Active users data
  const activeUsers = [
    { _id: 1, name: 'Diệp Thảo Nguyễn Văn', email: 'diepthaonguyenvanbmt@gmail.com', username: 'Moderator' },
    { _id: 2, name: 'Thai Hoang Anh', email: 'zinmx205@gmail.com', username: 'Moderator' },
    { _id: 3, name: 'Thong Hoang', email: 'thongdzpro100@gmail.com', username: 'User' },
    { _id: 4, name: 'Trần Anh', email: 'tran.anh@gmail.com', username: 'User' },
    { _id: 5, name: 'Jane Doe', email: 'jane.doe@example.com', username: 'User' },
  ];

  // Deleted users data
  const deletedUsers = [
    { _id: 6, name: 'John Smith', email: 'john.smith@example.com', username: 'User' },
    { _id: 7, name: 'Mary Johnson', email: 'mary.j@example.com', username: 'Moderator' },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers =
    tabValue === 0
      ? activeUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : deletedUsers.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddUser = () => {
    navigate(`/admin/users/101/add-user`);
  };

  return (
    <Box sx={{ p: 3, mt: '70px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ display: tabValue === 0 ? 'flex' : 'none' }}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Tabs and Refresh */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Active Accounts" />
              <Tab label="Deleted Accounts" />
            </Tabs>
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Search Field */}
          <TextField
            placeholder="Search users..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Users Table Component */}
          {filteredUsers.length > 0 ? (
            <UserTable users={filteredUsers} activeTab={tabValue} />
          ) : (
            <Typography sx={{ textAlign: 'center', mt: 5 }}>No users found</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Users;
