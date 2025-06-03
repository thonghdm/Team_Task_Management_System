import axios from 'axios';

export const uploadChatFile = async (accessToken, fileData) => {
    console.log('accessTokenapi:', accessToken);
    try {
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('conversationId', fileData.conversationId);
        formData.append('uploadedBy', fileData.uploadedBy);
        
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/chat-files/upload`, formData, {
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

export const downloadChatFile = async (accessToken, messageId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/chat-files/files/${messageId}/download`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            responseType: 'blob',
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getChatFilesByConversationId = async (accessToken, conversationId) => {
    try {
        const url = `${import.meta.env.VITE_URL_SERVER}/api/chat-files/${conversationId}/files`;
        
        const response = await axios.get(url, {
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        throw error;
    }
}; 