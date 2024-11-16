import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Button,
  styled,
  useTheme,
  useMediaQuery,
  TextField
} from '@mui/material';
import {
  Close,
  AccessTime,
  Chat,
  People,
  VideoCall,
  Phone,
  Email,
  LocationOn,
  Business,
  KeyboardArrowRight,
  Send
} from '@mui/icons-material';
// Custom styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    maxWidth: 800,
    width: '100%',
    margin: theme.spacing(2)
  }
}));

const StatusBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -4,
  right: -4,
  width: 24,
  height: 24,
  backgroundColor: '#ffd700',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const ProfileDialog = ({ open, onClose, member }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [inputValue, setInputValue] = React.useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogContent sx={{ bgcolor: theme.palette.text.disabled }}>
        <Box sx={{ p: 2, pb: "0px", position: 'relative' }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.text.secondary
            }}
          >
            <Close />
          </IconButton>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box position="relative">
              <Avatar
                sx={{ width: 80, height: 80 }}
                src={member?.memberId?.image}
                alt={member?.memberId?.displayName}
              />
              {/* <StatusBadge>
                <AccessTime sx={{ width: 16, height: 16, color: '#fff' }} />
              </StatusBadge> */}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                {member?.memberId?.displayName}
              </Typography>
              {member?.memberId?.jobTitle ? (
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {member?.memberId?.jobTitle} • {member?.memberId?.department}
                </Typography>
              ) : null}

            </Box>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <Chat />
            </IconButton>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <People />
            </IconButton>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <VideoCall />
            </IconButton>
            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
              <Phone />
            </IconButton>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { color: theme.palette.text.primary },
            '& .Mui-selected': { color: theme.palette.secondary.contrastText }
          }}
        >
          <Tab label="Overview" />
          {/* <Tab label="Contact" /> */}
          <Tab label="Organization" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            {/* Last Seen Section */}

            <Box sx={{ display: 'flex', mb: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Send a quick mesage"
                fullWidth
                size="small"
                value={inputValue}
                onChange={handleInputChange}
                multiline
                maxRows={4}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
              <IconButton size="small">
                <Send fontSize="medium" sx={{ color: theme.palette.secondary.contrastText, ml: 1 }} />
              </IconButton>
            </Box>
            {/* <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                p: 2,
                mb: 3
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessTime sx={{ color: '#ffd700' }} />
                <Typography>Last seen 5 minutes ago • Free on Nov 18</Typography>
              </Box>
              <Typography sx={{ color: theme.palette.text.secondary}}>
                Work hours: 8:00 AM - 5:00 PM
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <AccessTime sx={{ color: theme.palette.text.secondary}} />
                <Typography sx={{ color: theme.palette.text.secondary}}>
                  5:30 PM - Same time zone as you
                </Typography>
              </Box>
            </Box> */}

            {/* Contact Information Section */}
            <Typography variant="h6" sx={{ mb: 2, mt: 2, color: theme.palette.text.primary }}>
              Contact information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Email sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Email
                    </Typography>
                    <Typography sx={{ color: theme.palette.secondary.contrastText }}>
                      {member?.memberId?.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {member?.memberId?.phoneNumber && <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chat sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Phone Number
                    </Typography>
                    <Typography sx={{ color: theme.palette.secondary.contrastText }}>
                      {member?.memberId?.phoneNumber}
                    </Typography>
                  </Box>
                </Box>
              </Grid>}
              {member?.memberId?.company && <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Business sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Company
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{member?.memberId?.company}</Typography>
                  </Box>
                </Box>
              </Grid>}

              {member?.memberId?.location && <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOn sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Location
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{member?.memberId?.location}</Typography>
                  </Box>
                </Box>
              </Grid>}

              {member?.memberId?.jobTitle && <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOn sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Job title
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{member?.memberId?.jobTitle}</Typography>
                  </Box>
                </Box>
              </Grid>}

              {member?.memberId?.department && <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <LocationOn sx={{ color: theme.palette.text.secondary }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Department
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.primary }}>{member?.memberId?.department}</Typography>
                  </Box>
                </Box>
              </Grid>}
            </Grid>

            {/* <Button
              endIcon={<KeyboardArrowRight />}
              sx={{ color: '#29b6f6', textTransform: 'none' }}
            >
              Show more contact information
            </Button> */}

            {/* Reports To Section */}
            <Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
              Reports to
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Avatar alt={member?.user_invite?.displayName} src={member?.user_invite?.image} />
              <Box>
                <Typography sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>{member?.user_invite?.displayName}</Typography>
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                {member?.user_invite?.jobTitle}
                </Typography>
              </Box>
            </Box>

            {/* <Button
              endIcon={<KeyboardArrowRight />}
              sx={{ color: '#29b6f6', textTransform: 'none' }}
            >
              Show organization
            </Button> */}
          </Box>
        )}
      </DialogContent>
    </StyledDialog>
  );
};

export default ProfileDialog;