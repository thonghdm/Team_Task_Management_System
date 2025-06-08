import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Toolbar,
  Typography,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Home as HomeIcon,
  AssignmentTurnedIn as TaskIcon,
  Inbox as InboxIcon,
  Chat as ChatIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SidebarList from '../SidebarList';
import { fetchProjectsByMemberId } from '~/redux/project/projectArray-slice';
import { getStarredThunks } from '~/redux/project/starred-slice';
import { getSubscriptionByUserThunks } from '~/redux/project/subscription-slice';
import UpgradePlan from '~/pages/UpgradePlan';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  },
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7),
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  fontWeight: 600,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  letterSpacing: '0.5px',
}));

const TrialInfo = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
  borderRadius: 8,
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const ScrollableSection = styled(Box)(({ theme }) => ({
  maxHeight: '52vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
    borderRadius: '2px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  fontSize: '14px',
}));

const AddButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
    transform: 'scale(1.1)',
  },
}));

const UpgradeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  borderRadius: 8,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
}));

const PlanBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
  '& .MuiBox-root': {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.main,
    boxShadow: `0 0 8px ${theme.palette.primary.main}`,
  },
}));

const mainLinkData = [
  { projectName: 'Home', _id: 'home', icon: <HomeIcon />, main: 'Home' },
  { projectName: 'My tasks', _id: 'tasks', icon: <TaskIcon />, main: 'My tasks' },
  { projectName: 'Inbox', _id: 'inbox', icon: <InboxIcon />, main: 'Inbox' },
  { projectName: 'ChatAI', _id: 'chat-ai', icon: <ChatIcon />, main: 'ChatAI' },
];

const Sidebar = ({ open }) => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { accesstoken, userData, isLoggedIn } = useSelector(state => state.auth)
  const { projects } = useSelector((state) => state.projects);

  useEffect(() => {
    if (accesstoken && userData?._id) {
      dispatch(fetchProjectsByMemberId({ accesstoken, memberId: userData._id }));
    }
  }, [dispatch, accesstoken, userData?._id]);

  const { starred } = useSelector((state) => state.starred);

  useEffect(() => {
    if (accesstoken && userData?._id) {
      dispatch(getStarredThunks({ accesstoken, memberId: userData._id }));
    }
  }, [dispatch, accesstoken, userData?._id, isLoggedIn]);

  const convertBtoA = (B) => {
    if (!Array.isArray(B)) {
      console.error("Input B is not a valid array:", B);
      return [];
    }

    return B.map(itemB => {
      if (!itemB || !itemB.projectId) {
        return null;
      }

      return {
        ...itemB.projectId,
        _id: itemB.projectId?._id || null,
        projectName: itemB.projectId?.projectName || "Unknown",
        isStarred: itemB.isStarred || false
      };
    }).filter(item => item !== null);
  };

  const [openUpgradePlan, setOpenUpgradePlan] = useState(false);
  const handleOpenUpgradePlan = () => {
    setOpenUpgradePlan(true);
  };

  const handleCloseUpgradePlan = () => {
    setOpenUpgradePlan(false);
  };

  const subscription = useSelector(state => state.subscription.subscription);
  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        if (userData && userData._id) {
          await dispatch(getSubscriptionByUserThunks({ accesstoken, userId: userData._id })).unwrap();
        }
      } catch (error) {
        console.error("Error fetching subscription fetchUserSubscriptions:", error.message);
      }
    };

    if (userData?._id) {
      fetchUserSubscriptions();
    }
  }, [accesstoken, userData, dispatch]);

  const [isCurrentPlan, setIsCurrentPlan] = useState(null);
  const [isMainLinkData, setIsMainLinkData] = useState([]);

  useEffect(() => {
    if (subscription) {
      setIsCurrentPlan(subscription?.data[0]?.plan_id.subscription_type);
    }
  }, [subscription]);

  useEffect(() => {
    if (isCurrentPlan === 'Free') {
      const filteredData = mainLinkData.filter(item => item._id !== 'chat-ai');
      setIsMainLinkData(filteredData);
    } else {
      setIsMainLinkData(mainLinkData);
    }
  }, [isCurrentPlan]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' ---');
  };

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 64px)',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ fontSize: '14px' }}>
          <SidebarList linkData={isMainLinkData} Id={1} />
        </Box>

        <ScrollableSection>
          <Box>
            {projects?.projects?.length > 0 && (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <SectionTitle>Projects</SectionTitle>
                <AddButton
                  onClick={() => navigate('/projects-new', { state: { from: location.pathname } })}
                  size="small"
                >
                  <AddIcon sx={{ width: 20 }} />
                </AddButton>
              </Box>
            )}
            {projects?.projects && (
              <SidebarList linkData={projects?.projects} isProject={true} open={open} Id={2} />
            )}
          </Box>

          <Box>
            {starred?.data.length > 0 && (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <SectionTitle>Starred</SectionTitle>
              </Box>
            )}
            {starred?.data && (
              <SidebarList
                linkData={convertBtoA(starred?.data)}
                isProject={true}
                open={open}
                Id={3}
              />
            )}
          </Box>
        </ScrollableSection>

        <Box sx={{ marginTop: 'auto' }}>
          <TrialInfo>
            <PlanBadge>
              <Box />
              <Typography variant="subtitle2" fontWeight={600}>
                {isCurrentPlan} Plan
              </Typography>
            </PlanBadge>

            {isCurrentPlan === 'Free' ? (
              <>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Upgrade features premium
                </Typography>
                <UpgradeButton fullWidth onClick={handleOpenUpgradePlan}>
                  Upgrade Plan
                </UpgradeButton>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Premium features unlocked
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                  }}
                >
                  {subscription?.data[0]?.end_date
                    ? formatDate(subscription.data[0].end_date)
                    : ''}
                </Typography>
              </>
            )}
          </TrialInfo>
        </Box>
      </Box>
      <UpgradePlan open={openUpgradePlan} onClose={handleCloseUpgradePlan} />
    </StyledDrawer>
  );
};

export default Sidebar;