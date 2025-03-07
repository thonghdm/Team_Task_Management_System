import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { getNotifications, markAsReadNotification, markAllAsRead as markAllNotificationsAsRead } from "../apis/Project/notificationApi";

const SOCKET_SERVER_URL = "http://localhost:5000";

const useSocket = (userId, accesstoken) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const socketRef = useRef(null);

    // Fetch initial notifications
    useEffect(() => {
        if (!userId || !accesstoken) return;

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const data = await getNotifications(accesstoken, userId);
                setNotifications(data);
                
                // Calculate unread count
                const unreadNotifications = data.filter(notification => !notification.isRead).length;
                setUnreadCount(unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [userId, accesstoken]);

    // Initialize socket connection
    useEffect(() => {
        if (!userId) return;

        if (!socketRef.current) {
            socketRef.current = io(SOCKET_SERVER_URL, {
                withCredentials: true,
                transports: ["websocket"]
            });

            // Join user's personal room
            socketRef.current.emit("join", userId);
            console.log(`Joined room for user: ${userId}`);

            // Listen for notifications from server
            socketRef.current.on("newNotification", (notification) => {
                console.log("New notification received:", notification);
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    // Function to mark notifications as read
    const markAsRead = async (notificationId) => {
        if (!accesstoken) return;
        
        try {
            await markAsReadNotification(accesstoken, notificationId);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId 
                        ? { ...notif, isRead: true } 
                        : notif
                )
            );
            
            // Update unread count
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all notifications as read
    const markAllAsReadHandler = async () => {
        if (!accesstoken || !userId) return;
        
        try {
            // API call to mark all notifications as read
            await markAllNotificationsAsRead(accesstoken, userId);
            
            // Update local state
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            
            // Reset unread count
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Function to refresh notifications
    const refreshNotifications = async () => {
        if (!userId || !accesstoken) return;
        
        try {
            setLoading(true);
            const data = await getNotifications(accesstoken, userId);
            setNotifications(data);
            
            // Calculate unread count
            const unreadNotifications = data.filter(notification => !notification.isRead).length;
            setUnreadCount(unreadNotifications);
        } catch (error) {
            console.error('Error refreshing notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    return { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead: markAllAsReadHandler, 
        refreshNotifications,
        loading,
        socket: socketRef.current 
    };
};

export default useSocket;