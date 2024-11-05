import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Menu, MenuItem } from '@mui/material';
import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import HomeProjectItem from '~/Components/HomeProjectItem';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import './styles.css';
import ProjectStats from '~/pages/Projects/Content/Overview/ProjectStats';
import DialogAvt from '~/pages/Projects/DialogAvt';
import { fetchProjectDetail, resetProjectDetail } from '~/redux/project/projectDetail-slide';
import { extractTasksInfo } from '~/utils/extractTasksInfo';
import { useDispatch, useSelector } from 'react-redux'
import { fetchMemberProject } from '~/redux/project/projectRole-slice/memberProjectSlice';
import { useRefreshToken } from '~/utils/useRefreshToken'
import { ToastContainer, toast } from 'react-toastify';

const dataProjectDescription = {
  content: `<p>
Enter your project description</p>`
};

const profile = [
  { id: 1, name: 'Le Thi Be', email: 'hi@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 3, name: 'Nguyen Van A', email: 'nguyena@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 5, name: 'Nguyen Van C', email: 'nguyenc@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 11, name: 'Le Thi Be', email: 'hi@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 31, name: 'Nguyen Van A', email: 'nguyena@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 51, name: 'Nguyen Van C', email: 'nguyenc@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
];

const Overview = () => {
  const theme = useTheme();
  const { projectId } = useParams();
  const { projectData } = useSelector((state) => state.projectDetail);
  const { members } = useSelector((state) => state.memberProject);
  console.log('projectDataaaaaaaaaaaaa', projectData);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { accesstoken } = useSelector(state => state.auth)
  const [getTasksInfo, setTasksInfo] = useState([]);
  const dispatch = useDispatch();
  const refreshToken = useRefreshToken();
  useEffect(() => {
    
    console.log('memberssssssssssssss', members);
  }, [dispatch, projectId, accesstoken]);
  console.log('members', members);
  useEffect(() => {
    const getProjectDetail = async (token) => {
      try {
        await dispatch(fetchProjectDetail({ accesstoken: token, projectId })).unwrap();
      } catch (error) {
        if (error?.err === 2) {
          const newToken = await refreshToken();
          return getProjectDetail(newToken);
        }
        toast.error(error.response?.data.message || 'Unable to load project information!');
      } 
    };
  
    getProjectDetail(accesstoken);
  
    return () => {
      dispatch(resetProjectDetail());
    };
  }, [dispatch, projectId, accesstoken]);

  useEffect(() => {
    if (projectData) {
      const tasksInfo = extractTasksInfo(projectData?.project);
      setTasksInfo(tasksInfo);
    }
  }, [projectData]);
  const handleOpenShareDialog = () => setIsShareDialogOpen(true);
  const handleCloseShareDialog = () => setIsShareDialogOpen(false);

  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleRemove = () => {
    console.log(`Removing user: ${selectedUser.name}`);
    handleClose();
  };

  return (
    <>
      <Paper className="scrollable" elevation={3} sx={{ maxHeight: 500, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
        <Typography variant="h5" gutterBottom>
          Project description
        </Typography>
        <ProjectDescription initialContent={projectData?.project?.description||dataProjectDescription.content} />
      </Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
            <Typography variant="h5" gutterBottom>
              Project roles
            </Typography>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <HomeProjectItem
                    icon={<AddIcon sx={{ color: theme.palette.text.primary }} />}
                    title="Add member"
                    color="transparent"
                    onClick={handleOpenShareDialog}
                  />
                </Grid>
                {members?.members
                                ?.filter(member => member.is_active === true)
                                ?.map((member) => {
                  const role = member.id === 1 ? "Owner" : "Member";
                  return (
                    <Grid item xs={12} sm={6} md={3} key={member._id}>
                      <HomeProjectItem
                        icon={
                          member?.memberId?.image ? (
                            <img
                              src={member?.memberId?.image}
                              alt={member?.memberId?.displayName}
                              style={{ width: 40, height: 40, borderRadius: '50%' }}
                            />
                          ) : (
                            <Typography sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText
                            }}>
                              {member?.memberId?.displayName.charAt(0).toUpperCase()}
                            </Typography>
                          )
                        }
                        subtitle={role}
                        title={member?.memberId?.displayName}
                        onClick={(event) => role === "Member" ? handleClick(event, member) : null}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="scrollable" elevation={3} sx={{ maxHeight: 500, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
            <ProjectStats />
          </Paper>
        </Grid>
      </Grid>

      <DialogAvt
        open={isShareDialogOpen}
        onClose={handleCloseShareDialog}
        projectName={projectId}
        projectData={projectData}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={handleRemove}
          sx={{ color: 'red', fontWeight: theme.palette.error.main, fontSize: '0.875rem' }}
        >
          Remove from project
        </MenuItem>
      </Menu>
    </>
  );
};

export default Overview;