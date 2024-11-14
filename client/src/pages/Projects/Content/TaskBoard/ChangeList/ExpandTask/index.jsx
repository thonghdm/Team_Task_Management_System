import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    styled
} from '@mui/material';
import {
    Delete,
    Download,
    Lock
} from '@mui/icons-material';
import { DensityMedium as DensityMediumIcon } from '@mui/icons-material';
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
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.grey[800],
    },
    '& .MuiListItemIcon-root': {
        color: theme.palette.grey[400],
        minWidth: 36
    }
}));

const ExpandTask = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
        <>
            <IconButton
                onClick={handleClick}
                size="small"
            >
                <DensityMediumIcon
                    sx={{
                        width: '13px',
                        height: '13px',
                        cursor: 'pointer',
                    }} />
            </IconButton>

            <StyledMenu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <StyledMenuItem>
                    <ListItemIcon>
                        <Lock fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>View Details</ListItemText>
                </StyledMenuItem>

                <DeleteMenuItem onClick={() => setIsAlertOpen(true)}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete Task</ListItemText>
                </DeleteMenuItem>
            </StyledMenu>

            <AlertLeave
                open={isAlertOpen}
                onClose={handleCloseAlert}
                projectName="Confirm Delete Task"
                lable="Are you sure you want to delete task?"
                onConfirm={confirmLeaveProject}
            />
        </>
    );
};
export default ExpandTask;