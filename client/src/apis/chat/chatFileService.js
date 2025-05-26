import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const uploadChatFile = async (accessToken, fileData) => {
    console.log('accessTokenapi:', accessToken);
    try {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('conversationId', fileData.conversationId);
        formData.append('uploadedBy', fileData.uploadedBy);
        
        const response = await axios.post(`${API_URL}/chat-files/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getChatFilesByConversationId = async (accessToken, conversationId) => {
    console.log('API: getChatFilesByConversationId called with:', { accessToken: !!accessToken, conversationId });
    try {
        const url = `${API_URL}/chat-files/conversation/${conversationId}/files`;
        console.log('API: Making request to:', url);
        
        const response = await axios.get(url, {
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        });
        
        console.log('API: Response received:', response.data);
        return response.data;
    } catch (error) {
        console.error('API: Error in getChatFilesByConversationId:', error);
        console.error('API: Error response:', error.response?.data);
        throw error;
    }
}; 