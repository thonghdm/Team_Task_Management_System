import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import CallNotification from '~/pages/Inbox/Call-video/CallNotification';

const CallContext = createContext();

export const useCallContext = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [isProcessingCallResponse, setIsProcessingCallResponse] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Connect to Socket.IO when component mounts
    socket.connect();
    
    // Authenticate user
    if (userData?._id) {
      socket.emit("authenticate", { userId: userData?._id });
    }

    // Listen for incoming calls
    socket.on("incoming_call", (data) => {
      console.log("Incoming call:", data);
      if (data && data.call) {
        setIncomingCall({
          callId: data.call._id,
          caller: data.caller || {
            username: "Unknown",
            avatar: null
          },
          groupId: data.call.groupId || null,
        });
      }
    });

    // Disconnect when component unmounts
    return () => {
      socket.off("incoming_call");
      // Don't disconnect socket here as it might be needed by other components
    };
  }, [userData]);

  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    try {
      setIsProcessingCallResponse(true);

      // Send accept_call event to the backend
      socket.emit("accept_call", {
        callId: incomingCall.callId
      });

      // Open video call window
      const url = `/call-video/${incomingCall.groupId}`;
      window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");

      // Close notification
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
      alert("Cannot accept call. Please try again later.");
    } finally {
      setIsProcessingCallResponse(false);
    }
  };

  const handleDeclineCall = () => {
    if (!incomingCall) return;

    try {
      setIsProcessingCallResponse(true);

      // Send decline_call event to the backend
      socket.emit("decline_call", {
        callId: incomingCall.callId
      });

      // Close notification
      setIncomingCall(null);
    } catch (error) {
      console.error("Error declining call:", error);
    } finally {
      setIsProcessingCallResponse(false);
    }
  };

  const startCall = (callId, participantIds, groupId) => {
    socket.emit("initiate_call", {
      callId,
      caller: {
        userId: userData._id,
        username: userData.username,
        image: userData.image,
      },
      recipientIds: participantIds,
      groupId
    });
  };

  return (
    <CallContext.Provider value={{ startCall }}>
      {children}
      <CallNotification
        open={incomingCall !== null}
        caller={incomingCall?.caller}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
        isProcessing={isProcessingCallResponse}
      />
    </CallContext.Provider>
  );
};