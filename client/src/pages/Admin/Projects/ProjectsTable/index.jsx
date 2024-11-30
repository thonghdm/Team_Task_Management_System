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
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Groups as GroupsIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  Info as InfoIcon,
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

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case 'Public':
        return 'primary';
      case 'Member':
        return 'warning';
      default:
        return 'default';
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
    <Box>
      <TableContainer>
        <Table>
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
              <TableRow key={index}>
                {/* <TableCell>{project.projectName}</TableCell> */}

                <TableCell>
                  <Box sx={{ display: 'flex' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        marginRight: 1,
                        backgroundColor: project?.color,
                        borderRadius: '50%', // Makes it a circle
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Adds a shadow effect
                        border: '2px solid white' // Adds a border
                      }}
                    />
                    <Typography variant="body2">{project.projectName}</Typography>
                  </Box>

                </TableCell>

                <TableCell sx={{ display: 'flex' }}>
                  <Avatar sx={{
                    mr: 1, width: 30,
                    height: 30,
                    mt: "3px",
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Adds a shadow effect
                    border: '2px solid white' // Adds a border
                  }}
                    src={project?.ownerId?.image}
                  />
                  <Typography sx={{ mt: 1 }}>{project.ownerId.displayName}</Typography>

                </TableCell>
                <TableCell>
                  <Chip
                    label={project.visibility}
                    color={getVisibilityColor(project.visibility)}
                    size="small"
                  />
                </TableCell>
                {/* <TableCell>{project.deadline}</TableCell> */}
                <TableCell>{project.membersId.length} members</TableCell>
                {/* {isArchived ? (
                  <TableCell>{project.completedDate}</TableCell>

                  <Box>
                    <TableCell>
                      <Tooltip title={project.archiveReason}>
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                   </Box>
                ) : (
                  <TableCell>{project.startDate}</TableCell>
                )} */}
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={(event) => handleMenuOpen(event, project)}
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
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={projects.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
        {!isArchived ? (
          <Box>
            {/* <MenuItem onClick={handleEditProject}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit Project</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleOpenShareDialog}>
              <ListItemIcon>
                <GroupsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Manage Team</ListItemText>
            </MenuItem> */}
            {/* <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Project Settings</ListItemText>
            </MenuItem> */}
            {/* <Divider /> */}
            <MenuItem onClick={() => handleDeleteActive(selectedProject._id, "Delete")} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={() => handleDeleteActive(selectedProject._id, "Active")}>
              <ListItemIcon>
                <RestoreIcon fontSize="small" sx={{ color: '#27a6ab' }} />
              </ListItemIcon>
              <ListItemText sx={{ color: '#27a6ab' }} >Restore</ListItemText>
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem> */}
            {/* <Divider /> */}
            {/* <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Permanently</ListItemText>
            </MenuItem> */}
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
