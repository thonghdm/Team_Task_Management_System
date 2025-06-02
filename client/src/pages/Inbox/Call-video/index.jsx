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
import './styles.css';

// Khởi tạo hai clients Agora
const mainClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
const screenClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

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
  const [isCaller, setIsCaller] = useState(false);
  const [callStartTime, setCallStartTime] = useState(null);

  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [userAvatars, setUserAvatars] = useState({});
  const [showEndCallDialog, setShowEndCallDialog] = useState(false);
  const [endCallMessage, setEndCallMessage] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState(null);
  
  // New states for dual client management
  const [screenClientJoined, setScreenClientJoined] = useState(false);

  // Refs
  const localVideoRef = useRef(null);

  // Hàm hiển thị thông báo
  const showToast = (message, severity = "info") => {
    setNotification({ message, severity });
    setShowNotification(true);
  };

  // Đóng thông báo
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

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

  useEffect(() => {
    let timer;
    if (isCaller && callStartTime && remoteUsers.length === 0) {
      timer = setInterval(async () => {
        const now = new Date();
        const timeDiff = (now - callStartTime) / 1000;

        if (timeDiff >= 22) {
          setEndCallMessage("No one answered the call. The call will end.");
          setShowEndCallDialog(true);
          clearInterval(timer);
        }
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isCaller, callStartTime, remoteUsers.length]);

  // Tham gia cuộc gọi với main client
  const joinCall = async (agoraData) => {
    if (!agoraData) {
      setError("No connection information available");
      return;
    }
  
    try {
      setRemoteUsers([]);
      setLocalStream(null);
  
      if (!agoraData.channelName || !agoraData.token) {
        throw new Error("Incomplete connection information");
      }
  
      // Join main channel
      await mainClient.join(
        AppID,
        agoraData.channelName,
        agoraData.token,
        userData._id
      );
  
      // Set up event listeners
      setupEventListeners();
  
      // Create tracks
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
  
      setLocalStream({
        audioTrack,
        videoTrack
      });
  
      // Play local video
      setTimeout(() => {
        if (videoTrack && localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }
      }, 200);
  
      // Publish tracks
      await mainClient.publish([audioTrack, videoTrack]);
        
    } catch (err) {
      console.error("Error joining call:", err);
      setError(`Unable to join call: ${err.message}`);
    }
  };

  // Thiết lập các sự kiện cho main client
  const setupEventListeners = () => {
    mainClient.removeAllListeners();
    screenClient.removeAllListeners();
  
    // Main client events
    mainClient.on("user-joined", async (user) => {
      try {
        if (isCaller) {
          setCallStartTime(null);
        }
        
        const userName = await fetchUserName(user.uid);
        setUserNames(prev => ({
          ...prev,
          [user.uid]: userName
        }));
      } catch (err) {
        console.error("Error handling user-joined event:", err);
      }
    });

    mainClient.on("user-published", async (user, mediaType) => {
      try {
        await mainClient.subscribe(user, mediaType);
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
  
      } catch (err) {
        console.error("Error handling user-published event:", err);
      }
    });

    mainClient.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) => {
          return prevUsers.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, videoTrack: undefined };
            }
            return u;
          });
        });
      }
    });

    mainClient.on("user-left", (user) => {
        setRemoteUsers((prevUsers) => {
          return prevUsers.filter((u) => u.uid !== user.uid);
        });
    });

    // Screen client events
    screenClient.on("user-published", async (user, mediaType) => {
      try {
        await screenClient.subscribe(user, mediaType);
        if (mediaType === "video") {
          // Handle screen share from other users
          setRemoteUsers((prevUsers) => {
            const existingUser = prevUsers.find(u => u.uid === user.uid);
            if (existingUser) {
              return prevUsers.map((u) => 
                u.uid === user.uid ? { 
                  ...u, 
                  screenTrack: user.videoTrack,
                  displayName: userNames[user.uid] || 'User'
                } : u
              );
            }
            return [...prevUsers, { 
              uid: user.uid, 
              screenTrack: user.videoTrack,
              displayName: userNames[user.uid] || 'User'
            }];
          });
        }
      } catch (err) {
        console.error("Error handling screen client user-published event:", err);
      }
    });

    screenClient.on("user-unpublished", (user, mediaType) => {
      if (mediaType === "video") {
        setRemoteUsers((prevUsers) => {
          return prevUsers.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, screenTrack: undefined };
            }
            return u;
          });
        });
      }
    });
  };

  // Bật/tắt microphone
  const toggleMic = async () => {
    if (localStream && localStream.audioTrack) {
      if (micEnabled) {
        await localStream.audioTrack.setEnabled(false);
      } else {
        await localStream.audioTrack.setEnabled(true);
      }
      setMicEnabled(!micEnabled);
    }
  };

  // Bật/tắt camera
  const toggleCamera = async () => {
    if (localStream && localStream.videoTrack) {
      if (cameraEnabled) {
        await localStream.videoTrack.setEnabled(false);
      } else {
        await localStream.videoTrack.setEnabled(true);
      }
      setCameraEnabled(!cameraEnabled);
    }
  };

  // Modified screen sharing function to use dual clients
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        // Start screen sharing
        const screenVideoTrack = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: {
            width: 1920,
            height: 1080
          },
        });
        
        setScreenTrack(screenVideoTrack);
        
        if (!screenClientJoined) {
          const screenUserId = `${userData._id}_screen`;
          const response = await videoCallService.getCallById(accesstoken, callId, screenUserId);
          if (!response.success || !response.agoraData) {
            throw new Error("Unable to get connection information for screen sharing");
          }

          const { channelName, token } = response.agoraData;
          if (!channelName || !token) {
            throw new Error("Missing channel information for screen sharing");
          }

          // Join with the screen-specific token
          await screenClient.join(
            AppID,
            channelName,
            token,
            screenUserId
          );
          setScreenClientJoined(true);
        }
        
        // Publish screen track via screen client
        await screenClient.publish(screenVideoTrack);
        
        // Display screen share in local video
        screenVideoTrack.play(localVideoRef.current);
        
        setIsScreenSharing(true);
        showToast("Started screen sharing", "success");

        setRemoteUsers(prevUsers =>
          prevUsers.filter(u => !String(u.uid).includes('_screen'))
        );
      } else {
        // Stop screen sharing
        if (screenTrack) {
          await screenClient.unpublish(screenTrack);
          screenTrack.close();
          setScreenTrack(null);
        }
        
        // Leave screen client
        if (screenClientJoined) {
          await screenClient.leave();
          setScreenClientJoined(false);
          // Xóa user share screen khỏi remoteUsers
          setRemoteUsers(prevUsers =>
            prevUsers.filter(u => !String(u.uid).includes('_screen'))
          );
        }
        
        // Restore camera view
        if (localStream?.videoTrack) {
          localStream.videoTrack.play(localVideoRef.current);
        }
        
        setIsScreenSharing(false);
        showToast("Stopped screen sharing", "info");
      }
    } catch (error) {
      console.error("Screen sharing error:", error);
      // Reset state on error
      setIsScreenSharing(false);
      if (screenTrack) {
        screenTrack.close();
        setScreenTrack(null);
      }
      
      if (screenClientJoined) {
        try {
          await screenClient.leave();
        } catch (e) {
          console.error("Error leaving screen client:", e);
        }
        setScreenClientJoined(false);
      }

      // Restore camera view
      if (localStream?.videoTrack) {
        localStream.videoTrack.play(localVideoRef.current);
      }
    }
  };

  // Cleanup screen sharing
  useEffect(() => {
    return () => {
      if (screenTrack) {
        screenTrack.close();
      }
    };
  }, [screenTrack]);

  const { sendMessage, currentConversation, setCurrentConversation } = useChat();

  // Modified leave call function for dual clients
  const leaveCall = async () => {
    try {
      // Close local tracks
      if (localStream) {
        if (localStream.audioTrack) {
          localStream.audioTrack.close();
        }
        if (localStream.videoTrack) {
          localStream.videoTrack.close();
        }
      }

      // Close screen track
      if (screenTrack) {
        screenTrack.close();
      }

      // Leave both clients
      await mainClient.leave();
      
      if (screenClientJoined) {
        await screenClient.leave();
        setScreenClientJoined(false);
      }
      // Call API to update call status
      if (callId) {
        await videoCallService.leaveCall(accesstoken, callId);
      }

      if (callId && callInfo?.group && userData?._id === callInfo?.caller) {
        await videoCallService.endCall(accesstoken, callId);
      }

    } catch (error) {
      console.error("Error leaving call:", error);
    }
  };

  // Xử lý sự kiện khi người dùng rời khỏi cuộc gọi
  const handleEndCall = async () => {
    try {
      await leaveCall();
      window.close();
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
      ...mainClient.remoteUsers.map(user => ({ 
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

  // Update RemoteVideoView component
  const RemoteVideoView = ({ user }) => {
    const cameraContainerRef = useRef(null);
    const screenContainerRef = useRef(null);

    useEffect(() => {
      if (cameraContainerRef.current && user.videoTrack) {
        user.videoTrack.play(cameraContainerRef.current);
      }

      return () => {
        if (user.videoTrack) {
          user.videoTrack.stop();
        }
      };
    }, [user.videoTrack]);

    useEffect(() => {
      if (screenContainerRef.current && user.screenTrack) {
        user.screenTrack.play(screenContainerRef.current);
      }

      return () => {
        if (user.screenTrack) {
          user.screenTrack.stop();
        }
      };
    }, [user.screenTrack]);

    return (
      <div className={`remote-video-container ${user.screenTrack ? 'has-screen-share' : ''}`}>
        {/* Camera video */}
        <div ref={cameraContainerRef} style={{ width: '100%', height: '100%' }}>
          {!user.videoTrack && (
            <Box className="no-video-overlay">
              <Avatar 
                src={userAvatars[user.uid]}
                alt={userNames[user.uid]}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                {!userAvatars[user.uid] && (userNames[user.uid] || 'User').charAt(0)}
              </Avatar>
              <Typography className="no-video-text">
                {userNames[user.uid] || 'User'} (Camera off)
              </Typography>
            </Box>
          )}
        </div>
        
        
        {/* User info label */}
        <Typography className="user-info-label">
          <Avatar 
            src={userAvatars[user.uid]}
            alt={userNames[user.uid]}
            sx={{ 
              width: 24, 
              height: 24,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {!userAvatars[user.uid] && (userNames[user.uid] || 'User').charAt(0)}
          </Avatar>
          {userNames[user.uid] || 'User'}
        </Typography>
      </div>
    );
  };

  // Rest of the component remains the same...
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
  const filteredRemoteUsers = remoteUsers.filter(user => user.uid !== userData._id)
  const gridCols = filteredRemoteUsers.length > 3 ? 4 : (filteredRemoteUsers.length > 1 ? 6 : 12);
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
                <Badge badgeContent={mainClient.remoteUsers.length + 1} color="primary">
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
          {filteredRemoteUsers.length > 0 ? (
            filteredRemoteUsers.map((user) => (
              <Grid
                item
                key={user.uid}
                xs={12}
                sm={gridCols}
                md={gridCols}
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
        <Box className={`local-video-container fade-in ${isScreenSharing ? 'screen-sharing' : ''}`}>
          <div
            ref={localVideoRef}
            className="local-video"
            style={{ width: '100%', height: '100%' }}
          />
          <Typography className="local-video-label">
            You
            {!micEnabled && (
              <Box component="span" sx={{ ml: 1, color: '#ff3b30' }}>
                (Mic muted)
              </Box>
            )}
            {!cameraEnabled && (
              <Box component="span" sx={{ ml: 1, color: '#ff3b30' }}>
                (Camera off)
              </Box>
            )}
            {isScreenSharing && (
              <Box component="span" sx={{ ml: 1, color: '#34c759' }}>
                (Sharing screen)
              </Box>
            )}
          </Typography>
          {isScreenSharing && (
            <Box className="screen-sharing-indicator">
              <ScreenShareIcon sx={{ fontSize: '0.9rem' }} />
              Screen sharing
            </Box>
          )}
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
          className={isScreenSharing ? "control-button-active" : "control-button"}
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

      {/* Notifications */}
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

      {/* End Call Dialog */}
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