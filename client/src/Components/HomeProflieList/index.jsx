import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import HomeProjectItem from '~/Components/HomeProjectItem';
import { getRandomColor } from '~/utils/radomColor';
import HomeLable from '../HomeLable';
import '../HomeProjectList/styles.css'; // Ensure styles are imported

const profilesLinkData = [
  { id: 1, name: 'Le Thi Be', email: 'hi@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 2, name: 'Pham Van Huy', email: 'thongdzproo@gmail.com' },
  { id: 3, name: 'Nguyen Van A', email: 'nguyena@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 4, name: 'Tran Thi B', email: 'tranb@gmail.com' },
  { id: 3, name: 'Nguyen Van A', email: 'nguyena@gmail.com', image: "https://w7.pngwing.com/pngs/895/199/png-transparent-spider-man-heroes-download-with-transparent-background-free-thumbnail.png" },
  { id: 4, name: 'Tran Thi B', email: 'tranb@gmail.com' },
  // Additional profiles can be added here
];

const HomeProflieList = () => {
  const [projectColors, setProjectColors] = useState([]);

  useEffect(() => {
    const colors = profilesLinkData.map(() => getRandomColor());
    setProjectColors(colors);
  }, []); // This only runs once on mount

  return (
    <Paper elevation={3} sx={{ p: 2, backgroundColor: '#333', color: 'white', mt: 3 }}>
      <HomeLable lable={"Members"} />
      <Box className="scrollable">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <HomeProjectItem
              icon={<AddIcon sx={{ color: 'white' }} />}
              title="Invite member"
              color="transparent"
            />
          </Grid>

          {profilesLinkData.map((profile, index) => (
            <Grid item xs={6} key={profile.id}>
              <HomeProjectItem
                icon={
                  profile.image ? (
                    <img 
                      src={profile.image} 
                      alt={profile.name} 
                      style={{ width: 40, height: 40, borderRadius: '50%' }} // Rounded profile image
                    />
                  ) : (
                    <Typography sx={{ color: 'white' }}>
                      {profile.name.charAt(0)} {/* First letter of name if no image */}
                    </Typography>
                  )
                }
                title={profile.name}
                color={projectColors[index]} // Random color applied
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default HomeProflieList;
