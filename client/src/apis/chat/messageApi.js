import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const messageApi = {
    // Lấy danh sách tin nhắn của một cuộc trò chuyện
    getMessages: async (accessToken, conversationId, page = 1, limit = 50) => {
        try {
            const response = await axios.get(
                `${API_URL}/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    // Đánh dấu tin nhắn đã xem
    markMessageAsSeen: async (accessToken, messageId) => {
        try {
            const response = await axios.put(
                `${API_URL}/messages/${messageId}/seen`,
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking message as seen:', error);
            throw error;
        }
    },

    // Đánh dấu tất cả tin nhắn trong cuộc trò chuyện là đã xem
    markConversationAsRead: async (accessToken, conversationId) => {
        try {
            const response = await axios.put(
                `${API_URL}/conversations/${conversationId}/read`,
                {},
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error marking conversation as read:', error);
            throw error;
        }
    },

    // Lấy danh sách cuộc trò chuyện của user
    getConversationList: async (accessToken) => {
        try {
            const response = await axios.get(
                `${API_URL}/conversations/list`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tìm cuộc trò chuyện giữa 2 user (không tạo mới)
    getConversation: async (accessToken, userId, otherUserId) => {
        try {
            const response = await axios.get(
                `${API_URL}/conversations/find?userId=${userId}&otherUserId=${otherUserId}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Tạo cuộc trò chuyện giữa 2 user (chỉ tạo mới nếu chưa có)
    createConversation: async (accessToken, userId, otherUserId) => {
        try {
            const response = await axios.post(
                `${API_URL}/conversations/create`,
                { userId, otherUserId },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default messageApi; 