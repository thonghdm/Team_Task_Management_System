import React, { useState,useEffect } from 'react';
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
import { fetchAllMembers } from '~/redux/member/member-slice/index';

import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';


const Users = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Active users data
  const activeUsers = [
    { _id: 1, name: 'Diệp Thảo Nguyễn Văn', email: 'diepthaonguyenvanbmt@gmail.com', username: 'Moderator', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwbl_8kkN0-vMdzEdp1RRpWWp4zSKD8zsEag&s' },
    { _id: 2, name: 'Thai Hoang Anh', email: 'zinmx205@gmail.com', username: 'Moderator', avatar: 'https://image.made-in-china.com/2f0j00TdmaOvFqLzrh/Avt-230cc-4X4-Motorcycles-Vehicle-Beach-Mini-Jeep-for-Sale-with-Ce.webp' },
    { _id: 3, name: 'Thong Hoang', email: 'thongdzpro100@gmail.com', username: 'User' },
    { _id: 4, name: 'Trần Anh', email: 'tran.anh@gmail.com', username: 'User' },
    { _id: 5, name: 'Jane Doe', email: 'jane.doe@example.com', username: 'User' },
    { _id: 11, name: 'Diệp Tqưehảo Nguyễn Văn', email: 'diepthaonguyenvanbmt@gmail.com', username: 'Moderator' },
    { _id: 22, name: 'Thai Hqưeoang Anh', email: 'zinmx205@gmail.com', username: 'Moderator' },
    { _id: 31, name: 'Thong Hqưeoang', email: 'thongdzpro100@gmail.com', username: 'User' },
    { _id: 41, name: 'Trần Anqưeh', email: 'tran.anh@gmail.com', username: 'User' },
    { _id: 54, name: 'Jane Doeqưe', email: 'jane.doe@example.com', username: 'User' },
    { _id: 15, name: 'Diệp Thảqưeo Nguyễn Văn', email: 'diepthaonguyenvanbmt@gmail.com', username: 'Moderator' },
    { _id: 25, name: 'Thai Hoqưeang Anh', email: 'zinmx205@gmail.com', username: 'Moderator' },
    { _id: 352, name: 'Thong Hqưeoang', email: 'thongdzpro100@gmail.com', username: 'User' },
    { _id: 413, name: 'Trầnqưe Anh', email: 'tran.anh@gmail.com', username: 'User' },
    { _id: 5111, name: 'qưe Doe', email: 'jane.doe@example.com', username: 'User' },
  ];

  // Deleted users data
  const deletedUsers = [
    { _id: 6, name: 'John Smith', email: 'john.smith@example.com', username: 'User' },
    { _id: 7, name: 'Mary Johnson', email: 'mary.j@example.com', username: 'Moderator' },
  ];

  const { memberData } = useSelector((state) => state.allMember);


  // const dispatch = useDispatch();
  // const { accesstoken } = useSelector(state => state.auth)

  // const refreshToken = useRefreshToken();
  // useEffect(() => {
  //   const getAllMembers = async (token) => {
  //     try {
  //       await dispatch(fetchAllMembers({ accesstoken: token })).unwrap();
  //     } catch (error) {
  //       if (error?.err === 2) {
  //         const newToken = await refreshToken();
  //         return getAllMembers(newToken);
  //       }
  //       toast.error(error.response?.data.message || 'Unable to load project information!');
  //     }
  //   };

  //   getAllMembers(accesstoken);

  // }, [dispatch, accesstoken]);

  console.log(memberData);

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
