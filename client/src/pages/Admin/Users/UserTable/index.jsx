import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  ManageAccounts as ManageAccountsIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserTable = ({ users, activeTab }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };
  const handleEditUser = (userId) => {
    navigate(`/admin/users/101/edit-user/${userId}`);
    handleMenuClose();
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, user)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {activeTab === 0 ? (
          // Menu for Active Users
          <>
            <MenuItem onClick={() => handleEditUser(selectedUser._id)}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Password</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </>
        ) : (
          // Menu for Deleted Users
          <>
            <MenuItem onClick={handleMenuClose} sx={{ color: 'primary.main' }}>
              <ListItemIcon>
                <RestoreIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText>Restore</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Permanently</ListItemText>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default UserTable;