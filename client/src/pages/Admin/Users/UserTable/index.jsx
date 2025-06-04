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
  Paper,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  ManageAccounts as ManageAccountsIcon,
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
  DeleteForever as DeleteForeverIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { updateAll } from '~/apis/User/userService'
import { ToastContainer, toast } from 'react-toastify';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllMembers } from '~/redux/member/member-slice/index';
import {apiResetPasswordfromAdmin} from '~/apis/User/userService'

const UserTable = ({ users, activeTab }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, accesstoken } = useSelector(state => state.auth)
  const theme = useTheme();

  const generateStrongPassword= () => {
    const length = 8; // Độ dài mật khẩu
    const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()-_=+[]{}|;:,.<>?/';
    
    const allCharacters = lowerCaseLetters + upperCaseLetters + numbers + specialCharacters;
    
    // Đảm bảo rằng mật khẩu chứa ít nhất một ký tự từ mỗi nhóm
    const passwordArray = [
        lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
        upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    ];

    // Tạo phần còn lại của mật khẩu (tổng độ dài là 8 ký tự)
    for (let i = passwordArray.length; i < length; i++) {
        passwordArray.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    // Trộn các ký tự trong mảng mật khẩu để tạo độ ngẫu nhiên
    return passwordArray.sort(() => Math.random() - 0.5).join('');
}

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
  const handleResetPassword = async(email) => {
    const newPassword = generateStrongPassword();
    try {

      const handleSuccess = () => {
        toast.success(`Reset password email sent successfully!`);
        handleMenuClose();
      };
      const resetPassword = async (token) => {
        try {
          const response = await apiResetPasswordfromAdmin(token, email, newPassword);
          handleSuccess();
        } catch (error) {
          if (error.response?.status === 401) {
            const newToken = await refreshToken();
            return resetPassword(newToken);
          } throw new Error(`Failed to send reset password email!`);
        }
      };
      resetPassword(accesstoken);
    } catch (error) {
      toast.error(`Failed to send reset password email`);
    }
    handleMenuClose();
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
  console.log(paginatedUsers);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '$0';
    return `$${price.toFixed(2)}`;
  };

  return (
    <Box sx={{ 
      width: '100%',
      '& .MuiTableContainer-root': {
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }
    }}>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{
          '& .MuiTableCell-root': {
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            py: 2,
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
          '& .MuiTableBody-root .MuiTableRow-root': {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              transform: 'translateY(-1px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            },
          },
        }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow 
                key={index}
                sx={{
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(10px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar 
                      sx={{
                        width: 40,
                        height: 40,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '2px solid white',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                      src={user?.image}
                    />
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {user.displayName}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          display: 'block',
                        }}
                      >
                        {user.role || 'User'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title={user.email}>
                    <Typography 
                      sx={{ 
                        maxWidth: '200px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {user.username}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={user.subscription?.plan === 'Premium' ? <StarIcon /> : <AccessTimeIcon />}
                    label={user.subscription?.plan || 'No Plan'}
                    size="small"
                    sx={{
                      backgroundColor: user.subscription?.plan === 'Premium' 
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.grey[500], 0.1),
                      color: user.subscription?.plan === 'Premium'
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon 
                      sx={{ 
                        fontSize: '1rem',
                        color: theme.palette.text.secondary,
                      }} 
                    />
                    <Typography>
                      {formatDate(user.subscription?.endDate)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoneyIcon 
                      sx={{ 
                        fontSize: '1rem',
                        color: theme.palette.success.main,
                      }} 
                    />
                    <Typography sx={{ fontWeight: 600, color: theme.palette.success.main }}>
                      {formatPrice(user.subscription?.price)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, user)}
                      sx={{
                        color: theme.palette.primary.main,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'rotate(90deg)',
                        },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={users.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          '.MuiTablePagination-select': {
            borderRadius: '8px',
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            margin: 0,
          },
          '.MuiTablePagination-actions': {
            marginLeft: 2,
          },
        }}
      />

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
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: '12px',
            mt: 1,
            minWidth: '180px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            '& .MuiMenuItem-root': {
              py: 1.5,
              px: 2,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
        }}
      >
        {activeTab === 0 ? (
          <Box>
            <MenuItem 
              onClick={() => handleResetPassword(selectedUser.email)}
              sx={{
                '&:hover': {
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                },
              }}
            >
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset Password</ListItemText>
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem 
              onClick={() => handleDeleteActive(selectedUser._id, "Delete")}
              sx={{
                color: theme.palette.error.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'inherit' }} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem 
              onClick={() => handleDeleteActive(selectedUser._id, "Active")}
              sx={{
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <ListItemIcon>
                <RestoreIcon fontSize="small" sx={{ color: 'inherit' }} />
              </ListItemIcon>
              <ListItemText>Restore</ListItemText>
            </MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default UserTable;
