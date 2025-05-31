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
  Tooltip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import { useChat } from '~/Context/ChatProvider';
import videoCallService from "~/apis/inbox/videoCallService";
import { getMemberById } from '~/apis/User/userService'
import './styles.css'; // Tạo file CSS riêng


// Khởi tạo client Agora
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const AppID = '1bedaea2334b4daea7076508f65f51a4';


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
  const [isCaller, setIsCaller] = useState(false); // Thêm state để kiểm tra người gọi
  const [callStartTime, setCallStartTime] = useState(null); // Thêm state để lưu thời điểm bắt đầu cuộc gọi

  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [participantCount, setParticipantCount] = useState(0);
  const [showParticipants, setShowParticipants] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [userAvatars, setUserAvatars] = useState({});
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [endCallMessage, setEndCallMessage] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);


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

  // Hàm lấy thông tin người dùng
  const fetchUserName = async (userId) => {
    try {
      if (!userNames[userId]) {
        const response = await getMemberById(accesstoken, userId);
        if (response && response.success) {
          setUserNames(prev => ({
            ...prev,
            [userId]: response.member.displayName || 'User'
          }));
          setUserAvatars(prev => ({
            ...prev,
            [userId]: response.member.image || ''
          }));
          return response.member.displayName;
        }
      }
      return userNames[userId] || 'User';
    } catch (error) {
      console.error('Error fetching user name:', error);
      return 'User';
    }
  };

  // Lấy thông tin cuộc gọi và tham gia kênh
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);

        if (!accesstoken || !callId) {
          throw new Error("Invalid information. Please try again.");
        }

        const response = await videoCallService.getCallById(accesstoken, callId);
        if (response && response.success) {
          setCallInfo(response.call);
          setIsCaller(userData._id === response.call.caller);
          
          if (userData._id === response.call.caller) {
            setCallStartTime(new Date());
          }
          
          const localUserName = await fetchUserName(userData._id);
          setUserNames(prev => ({
            ...prev,
            [userData._id]: localUserName
          }));

          await joinCall(response.agoraData);
        } else {
          throw new Error("Unable to get call information");
        }
      } catch (error) {
        console.error("Call initialization error:", error);
        setError(`Error: ${error.message || "Unable to connect to the call. Please try again."}`);
      } finally {
        setLoading(false);
      }
    };

    if (accesstoken && callId) {
      initialize();
    } else {
      setError("Invalid information. Please try again.");
    }

    return () => {
      leaveCall();
    };
  }, [accesstoken, callId]);

  // Cập nhật useEffect để hiển thị dialog
  useEffect(() => {
    let timer;
    if (isCaller && callStartTime && remoteUsers.length === 0) {
      timer = setInterval(async () => {
        const now = new Date();
        const timeDiff = (now - callStartTime) / 1000; // Chuyển đổi sang giây

        if (timeDiff >= 22) {
          setEndCallMessage("No one answered the call. The call will end.");
          setShowEndCallDialog(true);
          clearInterval(timer);
        }
      }, 1000); // Kiểm tra mỗi giây
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isCaller, callStartTime, remoteUsers.length]);

  // Tham gia cuộc gọi
  const joinCall = async (agoraData) => {
    if (!agoraData) {
      setError("No connection information available");
      return;
    }
  
    try {
      // Clear existing state
      setRemoteUsers([]);
      setLocalStream(null);
  
      if (!agoraData.channelName || !agoraData.token) {
        throw new Error("Incomplete connection information");
      }
  
      // Join channel first
      await client.join(
        AppID,
        agoraData.channelName,
        agoraData.token,
        userData._id
      );
  
      // Set up event listeners before creating tracks
      setupEventListeners();
  
      // Create tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
  
      // Set local stream state
      setLocalStream({
        audioTrack,
        videoTrack
      });
  
      // Play local video immediately
      setTimeout(() => {
      if (videoTrack && localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }}, 200);
  
      // Publish tracks
      await client.publish([audioTrack, videoTrack]);
      
      showToast("Successfully joined the call!", "success");
  
    } catch (err) {
      console.error("Error joining call:", err);
      setError(`Unable to join call: ${err.message}`);
    }
  };

  
  // Thiết lập các sự kiện Agora
  const setupEventListeners = () => {
    client.removeAllListeners();
  
    // Xử lý khi có người tham gia mới
    client.on("user-joined", async (user) => {
      try {
        // Reset callStartTime khi có người tham gia
        if (isCaller) {
          setCallStartTime(null);
        }
        
        // Lấy tên người dùng ngay khi họ tham gia
        const userName = await fetchUserName(user.uid);
        setUserNames(prev => ({
          ...prev,
          [user.uid]: userName
        }));
      } catch (err) {
        console.error("Error handling user-joined event:", err);
      }
    });

    client.on("user-published", async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prevUsers) => {
            if (prevUsers.some((u) => u.uid === user.uid)) {
              return prevUsers.map((u) => 
                u.uid === user.uid ? { 
                  ...u, 
                  videoTrack: user.videoTrack,
                  displayName: userNames[user.uid] || 'User'
                } : u
              );
            }
            return [...prevUsers, { 
              uid: user.uid, 
              videoTrack: user.videoTrack,
              displayName: userNames[user.uid] || 'User'
            }];
          });
        }
  
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
  
        setParticipantCount(client.remoteUsers.length);
      } catch (err) {
        console.error("Error handling user-published event:", err);
      }
    });

    // Sự kiện khi user khác unpublish stream
    client.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        showToast(`A user has turned off their camera`, "warning");
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
        showToast(`A user has muted their microphone`, "warning");
      }
    });

    // Sự kiện khi user khác rời kênh
    client.on("user-left", (user) => {
      showToast(`A user has left the call`, "error");
      // Cập nhật số người tham gia
      setParticipantCount(prev => Math.max(0, prev - 1));

      setRemoteUsers((prevUsers) => {
        return prevUsers.filter((u) => u.uid !== user.uid);
      });
    });

    // // Sự kiện khi kết nối thay đổi
    // client.on("connection-state-change", (curState, prevState) => {
    //   if (curState === "CONNECTED") {
    //     showToast("Đã kết nối đến máy chủ Agora", "success");
    //   } else if (curState === "DISCONNECTED") {
    //     showToast("Mất kết nối với máy chủ, đang thử kết nối lại...", "error");
    //   } else if (curState === "CONNECTING") {
    //     showToast("Đang kết nối...", "info");
    //   }
    // });

    // Sự kiện lỗi
    client.on("exception", (event) => {
      showToast(`Error: ${event.code}`, "error");
    });
  };

  // Bật/tắt microphone
  const toggleMic = async () => {
    if (localStream && localStream.audioTrack) {
      if (micEnabled) {
        await localStream.audioTrack.setEnabled(false);
        showToast("Microphone muted", "warning");
      } else {
        await localStream.audioTrack.setEnabled(true);
        showToast("Microphone unmuted", "success");
      }
      setMicEnabled(!micEnabled);
    }
  };

  // Bật/tắt camera
  const toggleCamera = async () => {
    if (localStream && localStream.videoTrack) {
      if (cameraEnabled) {
        await localStream.videoTrack.setEnabled(false);
        showToast("Camera turned off", "warning");
      } else {
        await localStream.videoTrack.setEnabled(true);
        showToast("Camera turned on", "success");
      }
      setCameraEnabled(!cameraEnabled);
    }
  };

  // Thêm hàm xử lý screen sharing
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Bắt đầu chia sẻ màn hình
        const screenTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: {
            width: 1920,
            height: 1080
          },
        });
        
        // Lưu track để có thể dừng sau này
        setScreenTrack(screenTrack);
        
        // Unpublish video track hiện tại trước
        if (localStream?.videoTrack) {
          await client.unpublish(localStream.videoTrack);
          await localStream.videoTrack.setEnabled(false);
        }
        
        // Publish screen track
        await client.publish(screenTrack);
        
        // Hiển thị màn hình chia sẻ trong local video
        screenTrack.play(localVideoRef.current);
        
        setIsScreenSharing(true);
        showToast("Started screen sharing", "success");
      } else {
        // Dừng chia sẻ màn hình
        if (screenTrack) {
          await client.unpublish(screenTrack);
          screenTrack.close();
          setScreenTrack(null);
        }
        
        // Publish lại video track
        if (localStream?.videoTrack) {
          await localStream.videoTrack.setEnabled(true);
          await client.publish(localStream.videoTrack);
          localStream.videoTrack.play(localVideoRef.current);
        }
        
        setIsScreenSharing(false);
        showToast("Stopped screen sharing", "info");
      }
    } catch (error) {
      console.error("Screen sharing error:", error);
      showToast(`Screen sharing error: ${error.message}`, "error");
      
      // Reset state nếu có lỗi
      setIsScreenSharing(false);
      if (screenTrack) {
        screenTrack.close();
        setScreenTrack(null);
      }
      
      // Đảm bảo camera được publish lại
      if (localStream?.videoTrack) {
        await localStream.videoTrack.setEnabled(true);
        await client.publish(localStream.videoTrack);
        localStream.videoTrack.play(localVideoRef.current);
      }
    }
  };

  // Thêm cleanup cho screen sharing khi component unmount
  useEffect(() => {
    return () => {
      if (screenTrack) {
        screenTrack.close();
      }
    };
  }, [screenTrack]);

  const { sendMessage, currentConversation, setCurrentConversation } = useChat();

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
      showToast("Left the call", "info"); // Thông báo

      // Gọi API để cập nhật trạng thái cuộc gọi
      if (callId) {
        await videoCallService.leaveCall(accesstoken, callId);
      }

      // Nếu là cuộc gọi nhóm và người dùng là người gọi, kết thúc cuộc gọi
      if (callId && callInfo?.group && userData?._id === callInfo?.caller) {
        await videoCallService.endCall(accesstoken, callId);
      }
      // Nếu là cuộc gọi 1-1, chỉ cần leave call là đủ

    } catch (error) {
      console.error("Error leaving call:", error);
    }
  };



  // Xử lý sự kiện khi người dùng rời khỏi cuộc gọi
  const handleEndCall = async () => {
    try {
      await leaveCall();
      window.close(); // Đóng cửa sổ nếu là cửa sổ mới
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  // Thêm hàm xử lý đóng dialog và kết thúc cuộc gọi
  const handleDialogClose = async () => {
    setShowEndCallDialog(false);
    await handleEndCall();
  };

  // Component hiển thị danh sách người tham gia
  const ParticipantsList = () => {
    const allParticipants = [
      { 
        uid: userData._id, 
        isLocal: true,
        displayName: userNames[userData._id] || userData.displayName || 'You',
        avatar: userAvatars[userData._id] || userData.image || ''
      },
      ...client.remoteUsers.map(user => ({ 
        uid: user.uid, 
        isLocal: false,
        displayName: userNames[user.uid] || 'User',
        avatar: userAvatars[user.uid] || ''
      }))
    ];

    return (
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'absolute',
          top: '100%',
          right: 0,
          mt: 1,
          p: 2,
          zIndex: 1000,
          minWidth: '300px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          Participants ({allParticipants.length})
        </Typography>
        {allParticipants.map((participant) => (
          <Box 
            key={participant.uid} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              mb: 1.5,
              p: 1.5,
              borderRadius: '4px',
              bgcolor: participant.isLocal ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              border: '1px solid',
              borderColor: participant.isLocal ? 'primary.main' : 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Avatar 
                src={participant.avatar}
                alt={participant.displayName}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  mr: 1.5,
                  border: participant.isLocal ? '2px solid #1976d2' : 'none'
                }}
              >
                {!participant.avatar && participant.displayName.charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">
                  {participant.displayName}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    display: 'block'
                  }}
                >
                  ID: {participant.uid}
                </Typography>
              </Box>
              {participant.isLocal && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    ml: 1
                  }}
                >
                  You
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Paper>
    );
  };

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
          <Box className="no-video-overlay" sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.7)'
          }}>
            <Avatar 
              src={userAvatars[user.uid]}
              alt={userNames[user.uid]}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {!userAvatars[user.uid] && (userNames[user.uid] || 'User').charAt(0)}
            </Avatar>
            <Typography className="no-video-text" sx={{ color: 'white' }}>
              {userNames[user.uid] || 'User'} (Video bị tắt)
            </Typography>
          </Box>
        )}
        <Typography 
          className="user-info-label" 
          sx={{ 
            position: 'absolute', 
            bottom: 8, 
            left: 8, 
            background: 'rgba(0,0,0,0.5)', 
            color: 'white',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Avatar 
            src={userAvatars[user.uid]}
            alt={userNames[user.uid]}
            sx={{ width: 24, height: 24 }}
          >
            {!userAvatars[user.uid] && (userNames[user.uid] || 'User').charAt(0)}
          </Avatar>
          {userNames[user.uid] || 'User'}
        </Typography>
      </div>
    );
  };

  // Hiển thị loading
  if (loading) {
    return (
      <Box className="video-call-container loading-container">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Connecting...
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
          Close
        </IconButton>
      </Box>
    );
  }

  return (
    <Box className="video-call-container">
      {/* Header */}
      <Paper elevation={1} className="call-header">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6">
            {callInfo?.group ? `Group Call` : 'Video Call'}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", position: 'relative' }}>
            <Tooltip title="View participants">
              <IconButton 
                onClick={() => setShowParticipants(!showParticipants)}
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={client.remoteUsers.length + 1} color="primary">
                  <PeopleAltIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {showParticipants && <ParticipantsList />}
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
                Waiting for others to join...
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Local Video */}
        <Box className="local-video-container fade-in" sx={{ overflow: 'hidden' }}>
          <div
            ref={localVideoRef}
            className="local-video"
            style={{ width: '100%', height: '100%', backgroundColor: '#16213e' }}
          ></div>
          <Typography className="local-video-label">
            You {!micEnabled && "(Mic muted)"} {!cameraEnabled && "(Camera off)"}
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
          className={isScreenSharing ? "control-button-off" : "control-button"}
          onClick={toggleScreenShare}
          size="large"
        >
          {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
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

      {/* Thêm Dialog component */}
      <Dialog
        open={showEndCallDialog}
        onClose={handleDialogClose}
        aria-labelledby="end-call-dialog-title"
        aria-describedby="end-call-dialog-description"
        PaperProps={{
          sx: {
            minWidth: '320px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          id="end-call-dialog-title"
          sx={{
            bgcolor: 'warning.main',
            color: 'white',
            py: 2,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <CallEndIcon />
          Call Ended
        </DialogTitle>
        <DialogContent sx={{ py: 3, px: 3 }}>
          <Typography id="end-call-dialog-description" variant="body1">
            {endCallMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleDialogClose}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VideoCall;