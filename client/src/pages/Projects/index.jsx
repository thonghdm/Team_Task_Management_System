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
import { getProjectDetal } from '~/apis/Project/projectService'
import { useDispatch, useSelector } from 'react-redux'

const users = [
  { name: 'LV', imageUrl: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
  { name: 'JD', imageUrl: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
  { name: 'LV', imageUrl: 'https://www.codepwroject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },
  { name: 'JD', imageUrl: 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg' },

];

const defaultAvatar = 'https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/img.jpg';
const Projects = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  //ferch data project

  const [projects, setProjects] = useState([]);
  const { accesstoken, userData } = useSelector(state => state.auth)
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjectDetal(accesstoken, projectId);
        setProjects(data.project); // Update based on response structure
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProjects();
  }, [accesstoken, projectId]);

  console.log(projects)

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

  return (
      <Box sx={{ flexGrow: 1, p: 3, mt: '64px', backgroundColor: 'grey.50', minHeight: 'calc(100vh - 64px)' }}>
        <Paper elevation={3} sx={{ p: 2, backgroundColor: 'background.default', color: 'text.primary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', }}>
              <Typography variant="h6">{projects.projectName}</Typography>
              <IconButton
                sx={{ color: isClicked ? 'gold' : 'text.primary', ml: 1 }}
                onClick={handleIconClick}
              >
                <GradeIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex' }}>
              {users.length > 0 ? (
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
                  {users.map((user, index) => (
                    <Avatar
                      key={index}
                      alt={user.name}
                      src={user.imageUrl}
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

              <IconButton sx={{ color: 'text.primary' }}>
                <MoreHorizIcon />
              </IconButton>
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
          projectName={projectId}
        />

      </Box>
  );
};

export default Projects;
