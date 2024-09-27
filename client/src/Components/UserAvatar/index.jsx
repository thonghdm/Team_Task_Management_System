import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
} from '@mui/material';
import { 
  Person as PersonIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
// import { getInitials } from "../utils";

const UserAvatar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const imageUrl = 'httsps://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsX29mZmljZV8yOF9mZW1hbGVfbWluaW1hbF9yb2JvdF9mYWNlX29uX2RhcmtfYmFja2dyb3VuZF81ZDM3YjhlNy04MjRkLTQ0NWUtYjZjYy1hZmJkMDI3ZTE1NmYucG5n.png';
  const nameUser = 'Travis Howard';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setOpen(true);
    handleClose();
  };

  const handlePasswordClick = () => {
    setOpenPassword(true);
    handleClose();
  };

  const logoutHandler = () => {
    console.log("logout");
    handleClose();
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Avatar 
         src={imageUrl}
         alt={nameUser}
          sx={{ 
            width: { xs: 40, '2xl': 48 }, 
            height: { xs: 40, '2xl': 48 }, 
            bgcolor: 'primary.main',
            fontSize: { xs: 16, '2xl': 20 }
          }}
        >
          {/* {getInitials(user?.name)} */}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            width: 224,
            maxWidth: '100%',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>


        <MenuItem onClick={handlePasswordClick}>
          <ListItemIcon>
            <LockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>


        <MenuItem onClick={logoutHandler} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserAvatar;