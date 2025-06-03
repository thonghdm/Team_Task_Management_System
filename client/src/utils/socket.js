// src/socket.js
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_URL_SERVER}`, {
    withCredentials: true,
    transports: ["websocket"]   
});
socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
export default socket;