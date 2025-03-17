import React, { useEffect, useState, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Badge,
  Tooltip
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatIcon from '@mui/icons-material/Chat';
import videoCallService from "~/apis/inbox/videoCallService";
// import './styles.css'; // Tạo file CSS riêng

// Khởi tạo client Agora
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const AppID = '1bedaea2334b4daea7076508f65f51a4';
// const AppCertificate = '4888302425af4fa9a1d872fb03ba01dc';
// const ChannelName = '67d59fac2c71b42fb0197ff7';
// const Token = '007eJxTYLjBfUPvY4ZPT82Np7olgXOet17faLSAPfdZg6rD0iW+/ikKDIZJqSmJqYlGxsYmSSYglrmBuZmpgUWamWmaqWGiScjra+kNgYwMM+27mBgZIBDEl2AwM08xtUxLTDZKNjdMMjFKSzIwtDRPSzNnYAAAeMol7Q=='

const generateNumericUid = (userId) => {
  if (!userId) return Math.floor(Math.random() * 100000)
  return parseInt(userId.substring(0, 8), 16) % 100000000
}

const VideoCall = () => {
  const { callId } = useParams();
  const navigate = useNavigate();
  const { accesstoken, userData } = useSelector(state => state.auth);

  // Trạng thái
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callInfo, setCallInfo] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);


  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);


  // Hàm hiển thị thông báo
  const showToast = (message, severity = "info") => {
    setNotification({ message, severity });
    setShowNotification(true);
  };

  // Đóng thông báo
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  // Refs
  const localVideoRef = useRef(null);

  // Lấy thông tin cuộc gọi và tham gia kênh
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        // Kiểm tra accesstoken và callId có hợp lệ hay không
        if (!accesstoken || !callId) {
          throw new Error("Thông tin không hợp lệ. Vui lòng thử lại.");
        }

        // Lấy thông tin cuộc gọi
        const response = await videoCallService.getCallById(accesstoken, callId);
        console.log("Call info:", response);

        if (response && response.success) {
          setCallInfo(response.call);
          console.log("Call agoraData:", response.agoraData);
          // Tham gia kênh Agora
          await joinCall(response.agoraData);
        } else {
          throw new Error("Không thể lấy thông tin cuộc gọi");
        }
      } catch (error) {
        console.error("Lỗi khởi tạo cuộc gọi:", error);
        setError(`Lỗi: ${error.message || "Không thể kết nối đến cuộc gọi. Vui lòng thử lại."}`);
      } finally {
        setLoading(false);
      }
    };

    if (accesstoken && callId) {
      initialize();
    } else {
      setError("Thông tin không hợp lệ. Vui lòng thử lại.");
    }

    // Cleanup when unmounting
    return () => {
      leaveCall();
    };
  }, [accesstoken, callId]);


  // Tham gia cuộc gọi
  const joinCall = async (agoraData) => {
    if (!agoraData) {
      setError("Không có thông tin kết nối agoraData");
      return;
    }

    try {
      if (!agoraData.channelName || !agoraData.token) {
        throw new Error("Thông tin kết nối không đầy đủ");
      }
      console.log("Đã tham gia kênh Agora", agoraData);
      await client.join(
        AppID,
        agoraData.channelName,
        agoraData.token,
        generateNumericUid(agoraData.uid)
      );
      showToast("Đã tham gia cuộc gọi thành công!", "success"); // Thông báo thành công

      console.log("Đã tham gia kênh Agora");

      // Tạo và publish local tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();

      // Lưu local stream
      setLocalStream({
        audioTrack,
        videoTrack
      });

      // Hiển thị local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Publish tracks
      await client.publish([audioTrack, videoTrack]);
      console.log("Local tracks published");

      // Đăng ký các sự kiện
      setupEventListeners();

    } catch (err) {
      console.error("Lỗi tham gia cuộc gọi:", err);
      setError(`Không thể tham gia cuộc gọi: ${err.message}`);
    }
  };

  // Thiết lập các sự kiện Agora
  // Thiết lập các sự kiện Agora
  const setupEventListeners = () => {
    // Sự kiện khi user khác publish stream
    client.on("user-published", async (user, mediaType) => {
      // Subscribe to remote user
      await client.subscribe(user, mediaType);
      console.log("Đã subscribe đến user:", user.uid, mediaType);

      // Hiển thị thông báo người dùng tham gia
      showToast(`Người dùng mới đã tham gia cuộc gọi`, "info");

      // Cập nhật số người tham gia
      setParticipantCount(prev => prev + 1);

      // Nếu là video, hiển thị
      if (mediaType === "video") {
        // Thêm user vào danh sách remote users
        setRemoteUsers((prevUsers) => {
          // Nếu user đã tồn tại, cập nhật thông tin
          if (prevUsers.some((u) => u.uid === user.uid)) {
            return prevUsers.map((u) => {
              if (u.uid === user.uid) {
                return { ...u, videoTrack: user.videoTrack };
              }
              return u;
            });
          }
          // Nếu chưa có, thêm mới
          return [...prevUsers, { uid: user.uid, videoTrack: user.videoTrack }];
        });
      }

      // Nếu là audio, play audio
      if (mediaType === "audio") {
        user.audioTrack?.play();
        showToast(`Người dùng đã bật microphone`, "info");
      }
    });

    // Sự kiện khi user khác unpublish stream
    client.on("user-unpublished", (user, mediaType) => {
      console.log("User unpublished:", user.uid, mediaType);

      if (mediaType === "video") {
        showToast(`Một người dùng đã tắt camera`, "warning");
        setRemoteUsers((prevUsers) => {
          return prevUsers.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, videoTrack: undefined };
            }
            return u;
          });
        });
      }

      if (mediaType === "audio") {
        showToast(`Một người dùng đã tắt microphone`, "warning");
      }
    });

    // Sự kiện khi user khác rời kênh
    client.on("user-left", (user) => {
      console.log("User left:", user.uid);
      showToast(`Một người dùng đã rời khỏi cuộc gọi`, "error");

      // Cập nhật số người tham gia
      setParticipantCount(prev => Math.max(0, prev - 1));

      setRemoteUsers((prevUsers) => {
        return prevUsers.filter((u) => u.uid !== user.uid);
      });
    });

    // Sự kiện khi kết nối thay đổi
    client.on("connection-state-change", (curState, prevState) => {
      console.log("Connection state changed from", prevState, "to", curState);

      if (curState === "CONNECTED") {
        showToast("Đã kết nối đến máy chủ Agora", "success");
      } else if (curState === "DISCONNECTED") {
        showToast("Mất kết nối với máy chủ, đang thử kết nối lại...", "error");
      } else if (curState === "CONNECTING") {
        showToast("Đang kết nối...", "info");
      }
    });

    // Sự kiện lỗi
    client.on("exception", (event) => {
      console.log("Agora client exception:", event);
      showToast(`Lỗi: ${event.code}`, "error");
    });
  };

  // Bật/tắt microphone
  const toggleMic = async () => {
    if (localStream && localStream.audioTrack) {
      if (micEnabled) {
        await localStream.audioTrack.setEnabled(false);
        showToast("Đã tắt microphone", "warning");
      } else {
        await localStream.audioTrack.setEnabled(true);
        showToast("Đã bật microphone", "success");
      }
      setMicEnabled(!micEnabled);
    }
  };

  // Bật/tắt camera
  const toggleCamera = async () => {
    if (localStream && localStream.videoTrack) {
      if (cameraEnabled) {
        await localStream.videoTrack.setEnabled(false);
        showToast("Đã tắt camera", "warning");
      } else {
        await localStream.videoTrack.setEnabled(true);
        showToast("Đã bật camera", "success");
      }
      setCameraEnabled(!cameraEnabled);
    }
  };

  // Rời khỏi cuộc gọi
  const leaveCall = async () => {
    try {
      // Đóng local tracks
      if (localStream) {
        if (localStream.audioTrack) {
          localStream.audioTrack.close();
        }
        if (localStream.videoTrack) {
          localStream.videoTrack.close();
        }
      }

      // Rời khỏi kênh
      await client.leave();
      console.log("Đã rời khỏi kênh");
      showToast("Đã rời khỏi cuộc gọi", "info"); // Thông báo

      // Gọi API để cập nhật trạng thái cuộc gọi
      if (callId) {
        await videoCallService.endCall(accesstoken, callId);
      }

    } catch (error) {
      console.error("Lỗi khi rời khỏi cuộc gọi:", error);
    }
  };

  // Xử lý sự kiện khi người dùng rời khỏi cuộc gọi
  const handleEndCall = async () => {
    try {
      await leaveCall();
      window.close(); // Đóng cửa sổ nếu là cửa sổ mới
    } catch (error) {
      console.error("Lỗi khi kết thúc cuộc gọi:", error);
    }
  };

  // Hiển thị loading
  if (loading) {
    return (
      <Box className="video-call-container loading-container">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Đang kết nối...
        </Typography>
      </Box>
    );
  }

  // Hiển thị lỗi
  if (error) {
    return (
      <Box className="video-call-container error-container">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <IconButton
          color="primary"
          onClick={() => window.close()}
          sx={{ mt: 2 }}
        >
          Đóng
        </IconButton>
      </Box>
    );
  }

  // Component hiển thị video của người tham gia khác
  const RemoteVideoView = ({ user }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      if (containerRef.current && user.videoTrack) {
        user.videoTrack.play(containerRef.current);
      }

      return () => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
      };
    }, [user.videoTrack]);

    return (
      <div className="remote-video-container" ref={containerRef}>
        {!user.videoTrack && (
          <Typography className="no-video-text">Video bị tắt</Typography>
        )}
      </div>
    );
  };

  return (
    <Box className="video-call-container">
      {/* Header */}
      <Paper elevation={1} className="call-header">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {callInfo?.group ? `Cuộc gọi nhóm: ${callInfo.group.name}` : 'Cuộc gọi video'}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Số người tham gia">
              <Badge badgeContent={1 + remoteUsers.length} color="primary" sx={{ mr: 2 }}>
                <PeopleAltIcon />
              </Badge>
            </Tooltip>
            <Typography variant="body2">
              {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </Paper>
  
      {/* Video Grid */}
      <Box className="video-grid-container">
        {/* Remote Videos */}
        <Grid container spacing={2} className="remote-videos-grid">
          {remoteUsers.length > 0 ? (
            remoteUsers.map((user) => (
              <Grid
                item
                key={user.uid}
                xs={12}
                sm={remoteUsers.length > 1 ? 6 : 12}
                md={remoteUsers.length > 3 ? 4 : (remoteUsers.length > 1 ? 6 : 12)}
              >
                <RemoteVideoView user={user} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12} className="waiting-container">
              <Typography variant="h6">
                Đang chờ người khác tham gia...
              </Typography>
            </Grid>
          )}
        </Grid>
  
        {/* Local Video */}
        <Box className="local-video-container">
          <div ref={localVideoRef} className="local-video"></div>
          <Typography className="local-video-label">
            Bạn {!micEnabled && "(Đã tắt mic)"} {!cameraEnabled && "(Đã tắt camera)"}
          </Typography>
        </Box>
      </Box>
  
      {/* Controls */}
      <Box className="call-controls">
        <IconButton
          className={micEnabled ? "control-button" : "control-button-off"}
          onClick={toggleMic}
          size="large"
        >
          {micEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        
        <IconButton
          className={cameraEnabled ? "control-button" : "control-button-off"}
          onClick={toggleCamera}
          size="large"
        >
          {cameraEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
        
        <IconButton
          className="end-call-button"
          onClick={handleEndCall}
          size="large"
        >
          <CallEndIcon />
        </IconButton>
      </Box>
      
      {/* Thông báo */}
      <Snackbar
        open={showNotification}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification?.severity || "info"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VideoCall;