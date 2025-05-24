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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch, useSelector } from 'react-redux'
import { useRefreshToken } from '~/utils/useRefreshToken'
import { useParams } from 'react-router-dom';
import { updateProjectThunk } from '~/redux/project/project-slice/index';
import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { updateStarredThunks ,getStarredThunks} from '~/redux/project/starred-slice/index';
import { useNavigate } from 'react-router-dom';

import AIAssistant from '../AIAssistant';


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

const ProjectMenu = ({ isClickable = false }) => {
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

    ////////////////////////////////
    const { projectId } = useParams();
    const refreshToken = useRefreshToken();
    const dispatch = useDispatch();
    const { accesstoken, userData } = useSelector(state => state.auth)
    const navigate = useNavigate();

    const confirmLeaveProject = () => {
        try {
            const dataDelete = {
                isActive: false
            };
            const data = {
                projectId: projectId,
                userId: userData._id,
                isStarred: false
            }
            if (!isClickable) {
                toast.error('You do not have permission to delete this project!');
                return;
            }
            const handleSuccess = () => {
                toast.success('Delete project successfully!');
                handleCloseAlert();
                handleClose();
            };
            const deleteProject = async (token) => {
                try {
                    const resultAction = await dispatch(updateProjectThunk({
                        accesstoken: token,
                        projectId: projectId,
                        projectData: dataDelete
                    }));
                    if (updateProjectThunk.rejected.match(resultAction)) {
                        if (resultAction.payload?.err === 2) {
                            const newToken = await refreshToken();
                            return deleteProject(newToken);
                        }
                        throw new Error('Delete project failed');
                    }
                    await dispatch(fetchProjectsByMemberId({ accesstoken: token, memberId: userData._id }));
                    await dispatch(updateStarredThunks({
                        accesstoken: token,
                        data: data
                    }));
                    await dispatch(getStarredThunks({ accesstoken: token, memberId: userData._id }));
                    
                    navigate('/board/tasks/1/mytask');
                    handleSuccess();
                } catch (error) {
                    throw error;
                }
            };
            // Start the invite process
            deleteProject(accesstoken);
        }
        catch (error) {
            throw error;
        }
    };

    ////////////////////////////////
    const [AIAssistantOpen, setAIAssistantOpen] = useState(false);


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
                {/* <StyledMenuItem onClick={handleOpenDialog}>
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
                </StyledMenuItem> */}

                {/* <StyledDivider /> */}
                <StyledMenuItem onClick={() => {
                    setAIAssistantOpen(true);
                    handleClose();
                }}>
                    <ListItemIcon>
                        <Archive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>AI Assistant</ListItemText>
                </StyledMenuItem>

                <DeleteMenuItem onClick={() => setIsAlertOpen(true)}>
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

            <AIAssistant
                open={AIAssistantOpen}
                onClose={() => setAIAssistantOpen(false)}
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