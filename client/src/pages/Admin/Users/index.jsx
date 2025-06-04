import React, { useState, useEffect } from 'react';
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

import { getAllSubscription } from '~/apis/Project/subscriptionApi';



const Users = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { memberData } = useSelector((state) => state.allMember);


  const dispatch = useDispatch();
  const { accesstoken } = useSelector(state => state.auth)

  const refreshToken = useRefreshToken();
  useEffect(() => {
    const getAllMembers = async (token) => {
      try {
        await dispatch(fetchAllMembers({ accesstoken: token })).unwrap();
      } catch (error) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return getAllMembers(newToken);
        }
        toast.error(error.response?.data.message || 'Unable to load project information!');
      }
    };

    getAllMembers(accesstoken);

  }, [dispatch, accesstoken]);


  const [userBills, setUserBills] = useState([]);
  useEffect(() => {
    const getUserBills = async () => {
      const response = await getAllSubscription(accesstoken);
      setUserBills(response.data);
    }
    getUserBills();
  }, [accesstoken]);

  console.log(userBills);
  console.log(memberData);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const separateActiveInactiveUsers = (users) => {
    // Filter out users with isAdmin: true
    const nonAdminUsers = users?.filter(user => !user?.isAdmin);

    // Merge subscription data with user data
    const usersWithSubscription = nonAdminUsers?.map(user => {
      // Find the latest active subscription for this user
      const userSubscription = userBills?.find(bill => 
        bill.user_id === user._id && bill.is_active
      );

      return {
        ...user,
        subscription: userSubscription ? {
          plan: userSubscription.plan_id.subscription_type,
          endDate: new Date(userSubscription.end_date).toLocaleDateString(),
          maxProject: userSubscription.plan_id.max_project,
          maxMember: userSubscription.plan_id.max_member,
          price: userSubscription.plan_id.price
        } : null
      };
    });

    // Separate users based on is_active status
    const activeUsers = usersWithSubscription?.filter(user => user?.is_active);
    const deletedUsers = usersWithSubscription?.filter(user => !user?.is_active);

    return { activeUsers, deletedUsers };
  };
  const { activeUsers, deletedUsers } = separateActiveInactiveUsers(memberData?.users);

  const filteredUsers =
    tabValue === 0
      ? activeUsers?.filter((user) => user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
      : deletedUsers?.filter((user) => user?.displayName?.toLowerCase().includes(searchQuery.toLowerCase()));


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
          {filteredUsers?.length > 0 ? (
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
