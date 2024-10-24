import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tab,
  Tabs,
} from "@mui/material";
import { MoreHoriz as MoreHorizIcon } from "@mui/icons-material";
import HomeList from "~/Components/HomeList";
import HomeProjectList from "~/Components/HomeProjectList";
import HomeProflieList from "~/Components/HomeProflieList";
import HomeChart from "~/Components/HomeChart";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { logout, loginSuccess } from "~/redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { apiGetOne } from "~/apis/User/userService";
import { formattedDate } from "~/utils/formattedDate";
import { getTimeOfDay } from "~/utils/getTimeOfDay";
import { apiRefreshToken } from "~/apis/Auth/authService";

const Homes = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, typeLogin, accesstoken, userData } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // let response = await apiGetOne(accesstoken)
      } catch (error) {
        if (error.status === 401) {
          try {
            const response = await apiRefreshToken();
            await dispatch(
              loginSuccess({
                id: userData.id,
                tokenLogin: response.data.token,
              })
            );
          } catch (error) {
            console.log("error", error);
            if (error.status === 403) {
              alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
              await dispatch(logout());
              navigate("/");
            }
          }
        } else {
          console.log(error.message);
        }
      }
    };
    if (isLoggedIn) {
      fetchUser();
    }
  }, [isLoggedIn, accesstoken, typeLogin, dispatch, navigate, userData]);

  let data = isLoggedIn ? userData : {};

  // const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  // const [date, setDate] = useState(formattedDate);

  // useEffect(() => {
  //   setDate(formattedDate);
  //   setTimeOfDay(getTimeOfDay());
  // }, []);

  const displayName = data?.displayName
    ? data.displayName.match(/^\S+/)[0]
    : "User";
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        mt: "64px",
        backgroundColor: theme.palette.grey[50],
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ color: theme.palette.text.primary, mb: 2 }}
      >
        Home
      </Typography>

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
          {formattedDate}
        </Typography>
        <Typography variant="h3" sx={{ color: theme.palette.text.primary }}>
          Good {getTimeOfDay()}, {displayName}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Chip
            label="My month"
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              mr: 1,
            }}
          />
          <Chip
            label="0 tasks completed"
            icon={<span style={{ color: theme.palette.text.primary }}>✓</span>}
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              mr: 1,
            }}
          />
          <Chip
            label="0 collaborators"
            icon={<span style={{ color: theme.palette.text.primary }}>👥</span>}
            variant="outlined"
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
            }}
          />
        </Box>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 1 }} src={data?.image ? data?.image : undefined}>
            {!data?.image && data?.displayName}{" "}
          </Avatar>
          <Typography variant="h6">My tasks</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton sx={{ color: theme.palette.text.primary }}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
        <HomeList />
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 2 }}>
        <Box sx={{ flexBasis: "60%" }}>
          <HomeProjectList />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
          <HomeProflieList />
        </Box>
      </Box>

      <HomeChart />
    </Box>
  );
};

export default Homes;
