import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import socket from '~/utils/socket';
import CallNotification from '~/pages/Inbox/Call-video/CallNotification';
import { createPortal } from 'react-dom';

// Debug logger
const debugLog = (message, data) => {
  console.log(`CallProvider: ${message}`, data);
};

const CallContext = createContext();

export const useCallContext = () => useContext(CallContext);

export const CallProvider = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState(null);
  const [isProcessingCallResponse, setIsProcessingCallResponse] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const pingIntervalRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  
  // Setup the portal container for notifications
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let portalContainer = document.getElementById('call-notification-portal');
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = 'call-notification-portal';
        portalContainer.style.position = 'fixed';
        portalContainer.style.zIndex = '9999';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.width = '100%';
        portalContainer.style.height = '100%';
        portalContainer.style.pointerEvents = 'none';
        document.body.appendChild(portalContainer);
      }
    }
  }, []);

  // Set up socket connection and event listeners
  useEffect(() => {
    if (!userData?._id) {
      debugLog("No user data available, skipping socket setup");
      return;
    }

    const setupSocket = () => {
      // Handle socket connection
      const handleConnect = () => {
        debugLog("Socket connected", socket.id);
        
        // Authenticate the user
        socket.emit("authenticate", { userId: userData._id });
        
        // Start the ping interval to keep the connection alive
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = setInterval(() => {
          if (socket.connected) {
            socket.emit("ping", { userId: userData._id, timestamp: Date.now() });
          }
        }, 30000); // Ping every 30 seconds
      };

      // Handle authentication confirmation
      const handleAuthenticated = (data) => {
        debugLog("Authentication response", data);
        setIsAuthenticated(data.success === true);
      };

      // Handle socket disconnection
      const handleDisconnect = (reason) => {
        debugLog("Socket disconnected", reason);
        setIsAuthenticated(false);
        
        // Attempt to reconnect
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!socket.connected) {
            debugLog("Attempting to reconnect socket");
            socket.connect();
          }
        }, 3000); // Wait 3 seconds before reconnecting
      };

      // Handle incoming call
      const handleIncomingCall = (data) => {
        debugLog("Incoming call received", data);
        if (data && data.call) {
          setIncomingCall({
            callId: data.call._id,
            caller: data.caller || {
              username: "Unknown",
              avatar: null
            },
            groupId: data.call.groupId || null
          });
          
          // // Play a sound to alert the user (optional)
          // try {
          //   const audio = new Audio('/notification-sound.mp3'); // Path to your notification sound
          //   audio.play();
          // } catch (e) {
          //   console.error("Could not play notification sound", e);
          // }
        }
      };

      // Ensure the socket is connected
      if (!socket.connected) {
        debugLog("Socket not connected, connecting...");
        socket.connect();
      }

      // Clean up existing listeners to avoid duplicates
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("authenticated", handleAuthenticated);
      socket.off("incoming_call", handleIncomingCall);
      
      // Set up new listeners
      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("authenticated", handleAuthenticated);
      socket.on("incoming_call", handleIncomingCall);
      
      // If already connected, authenticate immediately
      if (socket.connected) {
        handleConnect();
      }

      // Return cleanup function
      return () => {
        debugLog("Cleaning up socket listeners");
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("authenticated", handleAuthenticated);
        socket.off("incoming_call", handleIncomingCall);
        
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };
    };

    // Set up the socket and get the cleanup function
    const cleanup = setupSocket();
    
    // Return the cleanup function
    return cleanup;
  }, [userData?._id]);

  // Handle accepting a call
  const handleAcceptCall = async () => {
    if (!incomingCall) return;

    try {
      debugLog("Accepting call", incomingCall.callId);
      setIsProcessingCallResponse(true);

      // Emit accept_call event
      socket.emit("accept_call", {
        callId: incomingCall.callId,
        userId: userData._id
      });

      // Open the call in a new window
      const url = `/call-video/${incomingCall.callId || incomingCall.groupId}`;
      window.open(url, "_blank", "width=900,height=600,noopener,noreferrer");

      // Clear the incoming call state
      setIncomingCall(null);
    } catch (error) {
      debugLog("Error accepting call", error);
      alert("Cannot accept call. Please try again later.");
    } finally {
      setIsProcessingCallResponse(false);
    }
  };

  // Handle declining a call
  const handleDeclineCall = () => {
    if (!incomingCall) return;

    try {
      debugLog("Declining call", incomingCall.callId);
      setIsProcessingCallResponse(true);

      // Emit decline_call event
      socket.emit("decline_call", {
        callId: incomingCall.callId,
        userId: userData._id
      });

      // Clear the incoming call state
      setIncomingCall(null);
    } catch (error) {
      debugLog("Error declining call", error);
    } finally {
      setIsProcessingCallResponse(false);
    }
  };

  // Function to start a call
  const startCall = (callId, participantIds, groupId) => {
    debugLog("Starting call", { callId, participantIds, groupId });
    
    if (!socket.connected) {
      debugLog("Socket not connected, connecting...");
      socket.connect();
      
      // Wait for connection before sending the event
      socket.once("connect", () => {
        // Authenticate and then emit
        socket.emit("authenticate", { userId: userData._id });
        socket.once("authenticated", () => {
          emitStartCall();
        });
      });
    } else {
      // We're already connected, just emit
      emitStartCall();
    }
    
    // Helper function to emit the event
    function emitStartCall() {
      socket.emit("initiate_call", {
        callId,
        caller: {
          userId: userData._id,
          username: userData.username || userData.displayName,
          image: userData.image
        },
        recipientIds: participantIds,
        groupId
      });
    }
  };

  // Create the context value
  const contextValue = {
    startCall,
    incomingCall,
    isProcessingCallResponse,
    isAuthenticated,
    isSocketConnected: socket.connected
  };

  return (
    <CallContext.Provider value={contextValue}>
      {children}
      {incomingCall && typeof document !== 'undefined' && createPortal(
        <div style={{ pointerEvents: 'auto' }}>
          <CallNotification
            open={true}
            caller={incomingCall.caller}
            onAccept={handleAcceptCall}
            onDecline={handleDeclineCall}
            isProcessing={isProcessingCallResponse}
          />
        </div>,
        document.getElementById('call-notification-portal')
      )}
    </CallContext.Provider>
  );
};