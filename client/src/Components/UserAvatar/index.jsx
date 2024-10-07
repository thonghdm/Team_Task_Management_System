import React, { useState,useEffect } from 'react';
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



const UserAvatar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(state => state.auth)
  const [userDataGG, setUserData] = useState({})
  useEffect(() => {
    const fetchUser = async () => {
      let response = await apiGetOne(accesstoken)
      console.log(response);
      if (response?.data.err === 0) {
        setUserData(response.data?.response)
      } else {
        setUserData({})
      }
    }
    fetchUser()
  }, [accesstoken])

  let data = {}
  if (isLoggedIn) {
    data = typeLogin ? userData : userDataGG
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    console.log("logout");
    handleClose();
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
              fontSize: 16
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
              mr: 2
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
        <MenuItem>
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
        <Divider />
        <ModeSelect />
        <Divider />

        <MenuItem>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemText>Add another account</ListItemText>
        </MenuItem>

        <MenuItem onClick={logoutHandler}>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserAvatar;