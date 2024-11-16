// Projects.js
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, IconButton, Button, AvatarGroup, Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { MoreHoriz as MoreHorizIcon, Grade as GradeIcon, Share as ShareIcon } from '@mui/icons-material';
import ProjectContent from '~/pages/Projects/ProjectContent';
import { useNavigate, useLocation } from 'react-router-dom';
import DialogAvt from '~/pages/Projects/DialogAvt';
import { useDispatch, useSelector } from 'react-redux'
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import ProjectMenu from './ProjectMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


import EditableText from '~/Components/EditableText';
import { updateProjectThunk } from '~/redux/project/project-slice';
import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { useRefreshToken } from '~/utils/useRefreshToken';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';


const defaultAvatar = 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg';
const Projects = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { accesstoken, userData } = useSelector(state => state.auth)
  const dispatch = useDispatch();
  const { projectData } = useSelector((state) => state.projectDetail);

  const { members } = useSelector((state) => state.memberProject);
  useEffect(() => {
    dispatch(fetchMemberProject({ accesstoken, projectId }));
  }, [dispatch, projectId, accesstoken]);
  const [isClicked, setIsClicked] = useState(false);

  const handleAvatarGroupClick = () => {
    setDialogOpen(true);
  };

  const handleIconClick = () => {
    setIsClicked(!isClicked);
    return true;
  };


  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleOpenShareDialog = () => setIsShareDialogOpen(true);
  const handleCloseShareDialog = () => setIsShareDialogOpen(false);

  const isOverViewActive = location.pathname.endsWith('/overview');
  const isListActive = location.pathname.endsWith('/task-board');
  const isBoardActive = location.pathname.endsWith('/project-board');

  /// save task name
  const refreshToken = useRefreshToken();
  const handleSaveTitle = (newText) => {
    try {
      const dataSave = {
        projectName: newText
      };
      const handleSuccess = () => {
        // toast.success('Update title task successfully!');
      };
      const saveTitleProject = async (token) => {
        try {
          const resultAction = await dispatch(updateProjectThunk({
            accesstoken: token,
            projectId: projectId,
            projectData: dataSave
          }));
          if (updateProjectThunk.rejected.match(resultAction)) {
            if (resultAction.payload?.err === 2) {
              const newToken = await refreshToken();
              return saveTitleProject(newToken);
            }
            throw new Error('Update title Project failed');
          }
          await dispatch(fetchProjectsByMemberId({ accesstoken: token, memberId: userData._id }));
          await dispatch(fetchProjectDetail({ accesstoken: token, projectId }));
          handleSuccess();
        } catch (error) {
          throw error;
        }
      };
      saveTitleProject(accesstoken);
    }
    catch (error) {
      throw error;
    }
  };
  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            {projectData && <Typography>
              <EditableText initialText={projectData?.project?.projectName}
                onSave={handleSaveTitle}
                maxWidth="1000px" t
                itleColor="primary.main" />
            </Typography>}
            <IconButton
              sx={{ color: isClicked ? 'gold' : 'text.primary', ml: 1 }}
              onClick={handleIconClick}
            >
              <GradeIcon />

            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex' }}>
            {members?.members?.length > 0 ? (
              <AvatarGroup
                max={3}
                onClick={handleAvatarGroupClick}
                sx={{
                  cursor: 'pointer',
                  '& .MuiAvatar-root': {
                    width: 30,
                    height: 30,
                    border: '2px solid #fff',
                    marginLeft: '-8px', // Adjust overlap
                    backgroundColor: 'background.paper',
                  },
                  '& .MuiAvatarGroup-avatar': {
                    fontSize: '0.75rem', // Size of the text in the "+x" avatar
                    width: 30,
                    height: 30,
                    backgroundColor: 'text.secondary',
                  }
                }}
              >
                {members.members
                  .filter(user => user.is_active === true)
                  .map((user, index) => (
                    <Avatar
                      key={index}
                      alt={user?.memberId?.displayName}
                      src={user?.memberId?.image}
                      onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
                    />
                  ))}
              </AvatarGroup>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No collaborators
              </Typography>
            )}
            <Button
              onClick={handleOpenShareDialog}
              sx={{
                padding: '2px 8px',
                fontSize: '0.75rem',
                minWidth: 'auto',
                height: '32px',
                margin: '2px',
                ml: 2,
              }}
              variant="outlined"
              startIcon={<ShareIcon />}
            >
              Share
            </Button>
            <ProjectMenu />
          </Box>
        </Box>
        <Button
          variant={isOverViewActive ? "contained" : "text"}
          onClick={() => navigate('overview')}
          sx={{ mr: 1 }}
        >
          Over View
        </Button>


        <Button
          variant={isBoardActive ? "contained" : "text"}
          onClick={() => navigate('project-board')}
          sx={{ mr: 1 }}
        >
          Board
        </Button>

        <Button
          variant={isListActive ? "contained" : "text"}
          onClick={() => navigate('task-board')}
        >
          List
        </Button>
      </Paper>
      <ProjectContent />

      <DialogAvt
        open={isShareDialogOpen}
        onClose={handleCloseShareDialog}
        projectName={projectData?.project?.projectName}
      />
    </Box>
  );
};

export default Projects;
