import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    styled
} from '@mui/material';
import {
    Edit,
    Lock,
    Palette,
    Link,
    ContentCopy,
    Save,
    Archive,
    Delete,
    ChevronRight,
    Add,
    Download
} from '@mui/icons-material';
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material';
import ProjectDetailsDialog from './ProjectDetailsDialog';

import AlertLeave from '~/pages/Projects/DialogAvt/AlertLeave';

// Styled components
const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        minWidth: 250,
        marginTop: theme.spacing(1)
    }
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.grey[800],
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.grey[400],
        minWidth: 36
    }
}));

const DeleteMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.background.default,
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.error.main,
        minWidth: 36
    },
    color: theme.palette.error.main
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    borderColor: theme.palette.grey[800]
}));

const ProjectMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openDialog, setOpenDialog] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
        handleClose();
    };


    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const handleCloseAlert = () => {
        setIsAlertOpen(false);
    };
    const confirmLeaveProject = () => {
        console.log('confirmLeaveProject');
        handleCloseAlert();
        handleClose();
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{ color: 'text.secondary' }}
            >
                <MoreHorizIcon />
            </IconButton>

            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <StyledMenuItem onClick={handleOpenDialog}>
                    <ListItemIcon>
                        <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit project details</ListItemText>
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Lock fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Manage project permissions</ListItemText>
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Palette fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Set color & icon</ListItemText>
                    <ChevronRight fontSize="small" sx={{ ml: 1 }} />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Link fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy project link</ListItemText>
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <ContentCopy fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Save fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Save as template</ListItemText>
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Add fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add to portfolio</ListItemText>
                </StyledMenuItem>

                <StyledDivider />

                <StyledMenuItem>
                    <ListItemIcon>
                        <Download fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Import</ListItemText>
                    <ChevronRight fontSize="small" sx={{ ml: 1 }} />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemText>Sync/Export</ListItemText>
                    <ChevronRight fontSize="small" sx={{ ml: 1 }} />
                </StyledMenuItem>

                <StyledMenuItem>
                    <ListItemIcon>
                        <Archive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive</ListItemText>
                </StyledMenuItem>

                <StyledDivider />

                <DeleteMenuItem  onClick={() => setIsAlertOpen(true)}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete project</ListItemText>
                </DeleteMenuItem>
            </StyledMenu>

            <ProjectDetailsDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            />



            <AlertLeave
                open={isAlertOpen}
                onClose={handleCloseAlert}
                projectName="Confirm Delete Project"
                lable="Are you sure you want to delete project?"
                onConfirm={confirmLeaveProject}
            />
        </div>
    );
};

export default ProjectMenu;