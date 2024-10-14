import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Menu, MenuItem } from '@mui/material';
import ProjectDescription from '~/pages/Projects/Content/Overview/ProjectDescription';
import HomeProjectItem from '~/Components/HomeProjectItem';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import './styles.css';
import ProjectStats from '~/pages/Projects/Content/Overview/ProjectStats';
import DialogAvt from '~/pages/Projects/DialogAvt';

const dataProjectDescription = {
  content: `<p>hiiiiii<span style="color: rgb(241, 250, 140);">The goal of this board is to give people a high level overview of what's happening throughout the company, with the ability to find details when they want to.&nbsp;Here's how it works</span>...</p>`
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

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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
    // Add your remove logic here
    console.log(`Removing user: ${selectedUser.name}`);
    handleClose();
  };

  return (
    <>
      <Paper className="scrollable" elevation={3} sx={{ maxHeight: 500, p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
        <ProjectDescription initialContent={dataProjectDescription.content} />
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
                {profile.map((user) => {
                  const role = user.id === 1 ? "Owner" : "Member";
                  return (
                    <Grid item xs={12} sm={6} md={3} key={user.id}>
                      <HomeProjectItem
                        icon={
                          user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
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
                              {user.name.charAt(0).toUpperCase()}
                            </Typography>
                          )
                        }
                        subtitle={role}
                        title={user.name}
                        onClick={(event) => role === "Member" ? handleClick(event, user) : null}
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