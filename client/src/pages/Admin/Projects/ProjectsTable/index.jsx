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
  const team = [
    { id: 1, name: 'Gia Huy Hồ', role: 'Owner' },
    { id: 2, name: 'Thanh Phạm', role: 'Editor' },
    { id: 3, name: 'Linh Nguyễn', role: 'Viewer' }
  ];

  const handleMenuOpen = (event, project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const paginatedProjects = projects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            {paginatedProjects.map((project, index) => (
              <TableRow key={index}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Chip
                    label={project.visibility}
                    color={getVisibilityColor(project.visibility)}
                    size="small"
                  />
                </TableCell>
                {/* <TableCell>{project.deadline}</TableCell> */}
                <TableCell>{project.team} members</TableCell>
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
            <MenuItem onClick={handleEditProject}>
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
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Project Settings</ListItemText>
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Archive Project</ListItemText>
            </MenuItem>
          </Box>
        ) : (
          <Box>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <RestoreIcon fontSize="small" sx={{ color: '#008000	' }} />
              </ListItemIcon>
              <ListItemText sx={{ color: '#008000	' }} >Restore Project</ListItemText>
            </MenuItem>
            {/* <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>View Details</ListItemText>
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText>Delete Permanently</ListItemText>
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
