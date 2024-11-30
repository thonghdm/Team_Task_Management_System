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
  TablePagination,
  Box,
  Avatar,
  Typography,
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

import { updateAll } from '~/apis/User/userService'
import { ToastContainer, toast } from 'react-toastify';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllMembers } from '~/redux/member/member-slice/index';


const UserTable = ({ users, activeTab }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, accesstoken } = useSelector(state => state.auth)

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // const handleEditUser = (userId) => {
  //   navigate(`/admin/users/101/edit-user/${userId}`);
  //   handleMenuClose();
  // };
  const refreshToken = useRefreshToken();

  const handleDeleteActive = (userId, check) => {
    try {
      let data = {
        _id: userId
      };

      if (check === "Delete") {
        data = {
          ...data,
          is_active: false,
        }
      } else {
        data = {
          ...data,
          is_active: true,
        }
      }

      const handleSuccess = () => {
        toast.success(`${check} user successfully!`);
        handleMenuClose();
      };
      const deleteUser = async (token) => {
        try {
          const response = await updateAll(token, data);
          await dispatch(fetchAllMembers({ accesstoken: token })).unwrap();
          handleSuccess();
          dispatch({
            type: actionTypes.USER_UPDATE_SUCCESS,
            data: { userData: response.data.response },
          });

        } catch (error) {
          if (error.response?.status === 401) {
            const newToken = await refreshToken();
            return deleteUser(newToken);
          } throw new Error(`${check} user failed!`);
        }
      };
      deleteUser(accesstoken);
    } catch (error) {
      toast.error(`Failed to ${check} user`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  // Calculate the users to display based on the current page and rows per page
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
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
            {paginatedUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell sx={{ display: 'flex' }}>
                  <Avatar sx={{ mr: 1 }}
                    src={user?.image}
                  />
                  <Typography sx={{ mt: 1 }}>{user.displayName}</Typography>

                </TableCell>
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

      {/* Pagination */}
      <TablePagination
        component="div"
        count={users.length} // Total number of users
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
      />

      {/* Actions Menu */}
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
          <Box>
            {/* <MenuItem onClick={() => handleEditUser(selectedUser._id)}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem> */}
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Password</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleDeleteActive(selectedUser._id, "Delete")} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Box>
        ) : (
          // Menu for Deleted Users
          <Box>
            <MenuItem onClick={() => handleDeleteActive(selectedUser._id, "Active")} sx={{ color: 'primary.main' }}>
              <ListItemIcon>
                <RestoreIcon fontSize="small" sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText>Restore</ListItemText>
            </MenuItem>
            {/* <Divider /> */}
            {/* <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Permanently</ListItemText>
            </MenuItem> */}
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default UserTable;
