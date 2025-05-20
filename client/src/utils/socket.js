// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
    withCredentials: true,
    transports: ["websocket"]   
});
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
export default socket;