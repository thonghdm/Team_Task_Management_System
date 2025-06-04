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
  Chip,
  Tooltip,
  Box,
  TablePagination,
  Typography,
  Avatar,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Groups as GroupsIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Public as PublicIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

import ProjectDetailsDialog from '~/pages/Projects/ProjectMenu/ProjectDetailsDialog';
import DialogAvt from '~/pages/Projects/DialogAvt';

import { updateProjectThunk, fetchProjectsThunk } from '~/redux/project/project-slice/index';
import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const ProjectsTable = ({ projects, isArchived }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  const theme = useTheme();

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'Public':
        return <PublicIcon fontSize="small" />;
      case 'Member':
        return <LockIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'Public':
        return {
          bg: alpha(theme.palette.primary.main, 0.1),
          color: theme.palette.primary.main,
        };
      case 'Member':
        return {
          bg: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
        };
      default:
        return {
          bg: alpha(theme.palette.grey[500], 0.1),
          color: theme.palette.text.secondary,
        };
    }
  };

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  ///temp team data
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleOpenShareDialog = () => setIsShareDialogOpen(true);
  const handleCloseShareDialog = () => setIsShareDialogOpen(false);

  ///edit project
  const [openDialog, setOpenDialog] = useState(false);
  const handleEditProject = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const getTableColumns = () => {
    const baseColumns = [
      { id: 'name', label: 'Project Name' },
      { id: 'client', label: 'Client' },
      { id: 'visibility', label: 'Visibility' },
      // { id: 'deadline', label: 'Deadline' },
      { id: 'team', label: 'Team Size' },
      // { id: 'status', label: 'Status' },
    ];

    if (isArchived) {
      return [
        ...baseColumns,
        // { id: 'completedDate', label: 'Completed Date' },
        // { id: 'archiveReason', label: 'Archive Reason' },
        { id: 'actions', label: 'Actions', align: 'right' },
      ];
    }

    return [
      ...baseColumns,
      // { id: 'startDate', label: 'Start Date' },
      { id: 'actions', label: 'Actions', align: 'right' },
    ];
  };

  const paginatedProjects = projects?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  ////////////////////////////////
  const refreshToken = useRefreshToken();
  const dispatch = useDispatch();
  const { accesstoken } = useSelector(state => state.auth)
  const navigate = useNavigate();

  const handleDeleteActive = (projectId, check) => {
    try {
      let data = {
        isActive: true
      }
      const handleSuccess = () => {
        toast.success(`${check} project successfully!`);
        handleMenuClose();
      };
      const deleteActiveUser = async (token) => {
        try {
          if (check === "Delete") {
            data = {
              isActive: false,
            }
          }
          const resultAction = await dispatch(updateProjectThunk({
            accesstoken: token,
            projectId: projectId,
            projectData: data
          }));
          if (updateProjectThunk.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return deleteActiveUser(newToken);
            }
            throw new Error(`${check} project failed`);
          }
          await dispatch(fetchProjectsThunk({ accesstoken: token }));
          handleSuccess();
        } catch (error) {

        }
      };
      deleteActiveUser(accesstoken);
    } catch (error) {
      toast.error(`Failed to ${check} project`);
    }
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
              {getTableColumns().map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProjects?.map((project, index) => (
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
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: project?.color || theme.palette.primary.main,
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        }
                      }}
                    >
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          color: '#fff',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}
                      >
                        {project.projectName?.charAt(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {project.projectName}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          display: 'block',
                        }}
                      >
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

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
                      src={project?.ownerId?.image}
                    />
                    <Box>
                      <Typography 
                        sx={{ 
                          fontWeight: 500,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {project?.ownerId?.displayName}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          display: 'block',
                        }}
                      >
                        Project Owner
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    icon={getVisibilityIcon(project.visibility)}
                    label={project.visibility}
                    size="small"
                    sx={{
                      backgroundColor: getVisibilityColor(project.visibility).bg,
                      color: getVisibilityColor(project.visibility).color,
                      fontWeight: 600,
                      '& .MuiChip-icon': {
                        color: 'inherit',
                      },
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon 
                      sx={{ 
                        fontSize: '1rem',
                        color: theme.palette.primary.main,
                      }} 
                    />
                    <Typography sx={{ fontWeight: 500 }}>
                      {project.membersId.length} members
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, project)}
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
        count={projects.length}
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
        {!isArchived ? (
          <Box>
            <MenuItem 
              onClick={() => handleDeleteActive(selectedProject._id, "Delete")}
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
              onClick={() => handleDeleteActive(selectedProject._id, "Active")}
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

      <ProjectDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        project={selectedProject}
      />

      <DialogAvt
        open={isShareDialogOpen}
        onClose={handleCloseShareDialog}
        projectName={selectedProject?.name}
      />
    </Box>
  );
};

export default ProjectsTable;
