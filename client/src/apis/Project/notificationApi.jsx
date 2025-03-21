import axios from "axios";

export const getNotifications = async (accesstoken, userId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/notifications/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createNotification = async (accesstoken, data) => {
    try {
        const response = await axios.post('http://localhost:5000/api/notifications/create', data, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markAsReadNotification = async (accesstoken, notificationId) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markAllAsRead = async (accesstoken, userId) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/notifications/read-all/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

