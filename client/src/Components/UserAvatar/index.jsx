import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  QuestionMark as QuestionMarkIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import ModeSelect from '../ModeSelect';
import { apiGetOne } from '~/apis/User/userService'
import { apiLogOut, apiRefreshToken } from '~/apis/Auth/authService'
import actionTypes from '~/redux/actions/actionTypes'
import Profile from '~/pages/Profile';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from '@mui/material/styles';

const UserAvatar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)
  const [hasFetchedUser, setHasFetchedUser] = useState(false); // Track if user data has been fetched
  const theme = useTheme();
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      setHasFetchedUser(true); 
      try {
        const response = await apiGetOne(accesstoken);
        dispatch({
          type: actionTypes.UPDATE_USER_DATA,
          data: { typeLogin: true, userData: response.data.response },
        });
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const response = await apiRefreshToken();
            dispatch({
              type: actionTypes.LOGIN_SUCCESS,
              data: { accesstoken: response.data.token, typeLogin: true, userData: response.data.userData },
            });
            setHasFetchedUser(false);
          } catch (refreshError) {
            if (refreshError.response?.status === 403) {
              alert("Your session has expired, please log in again.");
              dispatch({ type: actionTypes.LOGOUT });
              navigate('/');
            }
          }
        }
      }
    };

    if (isLoggedIn && (!userData || (isTokenExpired(accesstoken) && !hasFetchedUser))) {
      fetchUser();
    }
  }, [isLoggedIn, accesstoken, userData, hasFetchedUser, dispatch, navigate]);
  

  let data = isLoggedIn ? userData : {};
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const ProfileHandle = () => {
    navigate(`/profile/${userData._id}`);
  };

  const logoutHandler = async () => {
    try {
      const response = await apiLogOut();
      dispatch({
        type: actionTypes.LOGOUT,
      });
      navigate('/');
      localStorage.removeItem('chatMessages');
    } catch (error) {
      handleClose();
    };
  };

  const TransactionHistoryHandle = () => {
    navigate(`/transaction-history/${userData._id}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={handleClick}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              fontSize: 16,
              border:  `2px solid ${theme.palette.text.secondary}`,
            }}
            src={data?.image ? data?.image : undefined}  // Set the image if available
          >
            {!data?.image && data?.displayName}  {/* Display initials if no image */}
          </Avatar>

        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 300,
            maxWidth: '100%',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            bgcolor: 'background.paper',
            color: 'text.primary',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem sx={{ py: 2, px: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              fontSize: 20,
              mr: 2,
              border:  `2px solid ${theme.palette.text.secondary}`,
            }}
            src={data?.image ? data?.image : undefined}  // Set the image if available
          >
            {!data?.image && data?.displayName}  {/* Display initials if no image */}
          </Avatar>
          <Box>
            <Typography variant="subtitle1">{data?.displayName}</Typography>
            <Typography variant="body2" color="text.primary">{data?.email}</Typography>
          </Box>
        </MenuItem>
        <Divider />
        {/* <MenuItem>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Admin console</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>New workspace</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Invite to Asana</ListItemText>
        </MenuItem>
        <Divider /> */}
        <ModeSelect />
        <Divider />

        <MenuItem onClick={TransactionHistoryHandle}>
          <ListItemText>Transaction history</ListItemText>
        </MenuItem>

        {!userData?.isAdmin && <MenuItem onClick={ProfileHandle}>
          <ListItemText>Profile</ListItemText>
        </MenuItem>}
        {/* <MenuItem>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Add another account</ListItemText>
        </MenuItem> */}
        
        <MenuItem onClick={logoutHandler}>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserAvatar;