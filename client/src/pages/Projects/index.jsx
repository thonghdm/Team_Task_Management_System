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
import { useTheme } from '@mui/material/styles';

import { createStarred, getStarredThunks, updateStarredThunks } from '~/redux/project/starred-slice';

const defaultAvatar = '/225-default-avatar.png';
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
  const theme = useTheme();

  const { starred } = useSelector((state) => state.starred);

  // const isStarreds = starred?.data?.some(
  //   (item) => item?.projectId?._id === projectId && item?.userId === userData?._id && item?.isStarred
  // );
  const isStarreds = Array.isArray(starred?.data) && starred.data.some(
    (item) => item?.projectId?._id === projectId && item?.userId === userData?._id && item?.isStarred
  );

  const [isClicked, setIsClicked] = useState(isStarreds);


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
  const isDashedBoardActive = location.pathname.endsWith('/project-dashboard');
  const isCalendarActive = location.pathname.endsWith('/project-calendar');
  const isTimeLineActive = location.pathname.endsWith('/project-timeline');
  const isAuditLogActive = location.pathname.endsWith('/audit-log');
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

  /// Starred
  const handleStarred = () => {
    try {
      if (isClicked === false) {
        const data = {
          projectId: projectId,
          userId: userData._id
        }
        const handleSuccess = () => {
          // toast.success('Update title task successfully!');
          setIsClicked(true);
        };
        const saveStarredProject = async (token) => {
          try {
            const resultAction = await dispatch(createStarred({
              accesstoken: token,
              data: data
            }));
            if (createStarred.rejected.match(resultAction)) {
              if (resultAction.payload?.err === 2) {
                const newToken = await refreshToken();
                return saveStarredProject(newToken);
              }
              throw new Error('Starred failed');
            }
            await dispatch(getStarredThunks({ accesstoken: token, memberId: userData._id }));
            handleSuccess();
          } catch (error) {
            throw error;
          }
        };
        saveStarredProject(accesstoken);
      }
      else {
        const data = {
          projectId: projectId,
          userId: userData._id,
          isStarred: false
        }
        const handleSuccess = () => {
          // toast.success('Update title task successfully!');
          setIsClicked(false);
        };
        const updateStarredProject = async (token) => {
          try {
            const resultAction = await dispatch(updateStarredThunks({
              accesstoken: token,
              data: data
            }));
            if (updateStarredThunks.rejected.match(resultAction)) {
              if (resultAction.payload?.err === 2) {
                const newToken = await refreshToken();
                return updateStarredProject(newToken);
              }
              throw new Error('Starred failed');
            }
            await dispatch(getStarredThunks({ accesstoken: token, memberId: userData._id }));
            handleSuccess();
          } catch (error) {
            throw error;
          }
        };
        updateStarredProject(accesstoken);
      }
    } catch (error) {
      throw error;
    }
  }

  const currentUserRole = members?.members?.find(
    member => member?.memberId?._id === userData?._id
  )?.isRole;
  const isViewer = currentUserRole === 'Viewer';
  const isAdmin = currentUserRole === 'ProjectManager';

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
      <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', }}>
            {projectData && <Typography>
              <EditableText initialText={projectData?.project?.projectName}
                onSave={handleSaveTitle}
                maxWidth="1000px"
                itleColor="primary.main"
                isClickable={!isViewer}
              />
            </Typography>}

            <IconButton
              sx={{ color: isStarreds ? 'gold' : 'text.primary', ml: 1 }}
              onClick={handleStarred}
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
                    border: `2px solid ${theme.palette.text.secondary}`,

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
            <ProjectMenu isClickable={isAdmin}/>
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
          sx={{ ml: 1 }}
        >
          List
        </Button>

        <Button
          variant={isDashedBoardActive ? "contained" : "text"}
          onClick={() => navigate('project-dashboard')}
          sx={{ ml: 1 }}
        >
          DashBoard
        </Button>

        <Button
          variant={isCalendarActive ? "contained" : "text"}
          onClick={() => navigate('project-calendar')}
          sx={{ ml: 1 }}
        >
          Calendar
        </Button>

        <Button
          variant={isTimeLineActive ? "contained" : "text"}
          onClick={() => navigate('project-timeline')}
          sx={{ ml: 1 }}
        >
          TimeLine
        </Button>
        <Button
          variant={isAuditLogActive ? "contained" : "text"}
          onClick={() => navigate('audit-log')}
          sx={{ ml: 1 }}
        >
          AuditLog
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
