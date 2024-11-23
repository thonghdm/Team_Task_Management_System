import React, { useMemo, useState } from 'react';
import { Typography, Paper, Grid, Box, MenuItem, Select } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeProjectItem from '~/Components/HomeProjectItem';
import { getRandomColor } from '~/utils/radomColor';
import '../HomeProjectList/styles.css';
import { useTheme } from '@mui/material/styles';

const profilesLinkData = [
  { id: 1, name: 'Le Thi Be', email: 'hi@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 2, name: 'Pham Van Huy', email: 'thongdzproo@gmail.com' },
  { id: 3, name: 'Nguyen Van A', email: 'nguyena@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 4, name: 'Tran Thi B', email: 'tranb@gmail.com' },
  { id: 5, name: 'Nguyen Van C', email: 'nguyenc@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 6, name: 'Tran Thi D', email: 'trand@gmail.com' },
];

const HomeProflieList = () => {
  const theme = useTheme();

  const projectColors = useMemo(() => {
    return profilesLinkData.map(() => getRandomColor());
  }, []);
  const [period, setPeriod] = useState('frequentCollaborators');

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Members</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Select
          value={period}
          onChange={handlePeriodChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="frequentCollaborators">Frequent collaborators</MenuItem>
          <MenuItem value="recentCollaborators">Recent collaborators</MenuItem>
          <MenuItem value="starredCollaborators">Starred collaborators</MenuItem>
        </Select>
      </Box>
      <Box className="scrollable">
        <Grid container spacing={2}>
          {/* <Grid item xs={6}>
            <HomeProjectItem
              icon={<AddIcon sx={{ color: theme.palette.text.primary }} />}
              title="Invite member"
              color="transparent"
            />
          </Grid> */}

          {profilesLinkData.map((profile, index) => (
            <Grid item xs={6} key={`${profile.id}-${index}`}>
              <HomeProjectItem
                icon={
                  profile.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name}
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
                      {profile.name.charAt(0).toUpperCase()}
                    </Typography>
                  )
                }
                title={profile.name}
                color={projectColors[index]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default HomeProflieList;