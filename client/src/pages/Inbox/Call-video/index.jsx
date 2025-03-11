import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { Box, Typography, Button, Stack, Paper, IconButton } from "@mui/material";
import { Mic, MicOff, Videocam, VideocamOff, CallEnd } from "@mui/icons-material";

// Fix "global is not defined" error
if (typeof window !== 'undefined') {
  window.global = window;
}

const socket = io("http://localhost:5000");

// Video component for peer videos
const Video = ({ peer }) => {
  const ref = useRef();

  useEffect(() => {
    if (peer) {
      peer.on("stream", (stream) => {
        if (ref.current) {
          ref.current.srcObject = stream;
        }
      });
    }
  }, [peer]);

  return <video ref={ref} autoPlay playsInline style={videoStyle} />;
};

const VideoCall = () => {
  const roomID = "123"; // Room ID (should come from route params or state)
  const userVideo = useRef();
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const peersRef = useRef([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    // Get user media and setup connections
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        // Join the room after we have our media
        socket.emit("join-room", { roomID, userData: { name: `User-${socket.id}` } });

        // Handle new user joining
        socket.on("user-joined", (user) => {
          console.log(`${user.name} joined the room`);
          const peer = createPeer(user.id, currentStream);
          peersRef.current.push({ peerID: user.id, peer });
          setPeers(prevPeers => [...prevPeers, { peerID: user.id, peer }]);
        });

        // Handle incoming signal
        socket.on("signal", ({ from, signal }) => {
          console.log("Received signal from:", from);
          const item = peersRef.current.find(p => p.peerID === from);
          if (item) {
            try {
              item.peer.signal(signal);
            } catch (err) {
              console.error("Error processing signal:", err);
            }
          }
        });

        // Handle user disconnection
        socket.on("user-disconnected", (userID) => {
          console.log("User disconnected:", userID);
          const peerObj = peersRef.current.find(p => p.peerID === userID);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          
          // Remove the peer from our state
          peersRef.current = peersRef.current.filter(p => p.peerID !== userID);
          setPeers(prevPeers => prevPeers.filter(p => p.peerID !== userID));
        });
      })
      .catch(err => {
        console.error("Error accessing media devices:", err);
      });

    // Cleanup on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      socket.off("user-joined");
      socket.off("signal");
      socket.off("user-disconnected");
    };
  }, [roomID]);

  // Create a new peer connection
  const createPeer = (userID, stream) => {
    console.log("Creating peer connection to:", userID);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (signal) => {
      console.log("Sending signal to:", userID);
      socket.emit("signal", { to: userID, from: socket.id, signal });
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
    });

    return peer;
  };

  // Toggle audio mute
  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  // End call
  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    window.location.href = '/'; // Redirect to home or another route
  };

  return (
    <Box sx={containerStyle}>
      <Box sx={headerStyle}>
        <Typography variant="h5">Room: {roomID}</Typography>
      </Box>

      <Box sx={videoGridStyle}>
        {/* My Video */}
        <Paper elevation={3} sx={videoContainerStyle}>
          <video 
            ref={userVideo} 
            autoPlay 
            playsInline 
            muted // Always mute own video to prevent feedback
            style={{
              ...videoStyle,
              transform: 'scaleX(-1)' // Mirror own video
            }} 
          />
          <Box sx={videoLabelStyle}>
            <Typography variant="body2">You {isMuted && '(Muted)'}</Typography>
          </Box>
        </Paper>

        {/* Peer Videos */}
        {peers.map(({ peerID, peer }) => (
          <Paper key={peerID} elevation={3} sx={videoContainerStyle}>
            <Video peer={peer} />
            <Box sx={videoLabelStyle}>
              <Typography variant="body2">Peer {peerID.slice(0, 5)}...</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Stack direction="row" spacing={2} sx={controlsStyle}>
        <IconButton 
          onClick={toggleMute} 
          sx={{
            bgcolor: isMuted ? 'error.light' : 'primary.light',
            color: 'white',
            '&:hover': { bgcolor: isMuted ? 'error.main' : 'primary.main' }
          }}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </IconButton>
        
        <IconButton 
          onClick={toggleVideo} 
          sx={{
            bgcolor: isVideoOff ? 'error.light' : 'primary.light',
            color: 'white',
            '&:hover': { bgcolor: isVideoOff ? 'error.main' : 'primary.main' }
          }}
        >
          {isVideoOff ? <VideocamOff /> : <Videocam />}
        </IconButton>
        
        <IconButton 
          onClick={endCall} 
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': { bgcolor: 'error.dark' }
          }}
        >
          <CallEnd />
        </IconButton>
      </Stack>
    </Box>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  bgcolor: '#f5f5f5',
  p: 2
};

const headerStyle = {
  bgcolor: 'primary.main',
  color: 'white',
  p: 2,
  borderRadius: 2,
  mb: 2
};

const videoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 2,
  flex: 1,
  overflow: 'auto'
};

const videoContainerStyle = {
  position: 'relative',
  borderRadius: 2,
  overflow: 'hidden',
  aspectRatio: '16/9'
};

const videoStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  backgroundColor: '#000'
};

const videoLabelStyle = {
  position: 'absolute',
  bottom: 10,
  left: 10,
  bgcolor: 'rgba(0,0,0,0.6)',
  color: 'white',
  px: 1,
  py: 0.5,
  borderRadius: 1
};

const controlsStyle = {
  justifyContent: 'center',
  mt: 2,
  p: 2
};

export default VideoCall;