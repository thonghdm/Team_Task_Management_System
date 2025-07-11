import axios from 'axios';

export const getFileByIdTask = async (accesstoken, taskId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/file/tasks/${taskId}/files`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const downloadFile = async (accesstoken, fileId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/file/files/${fileId}/download`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            responseType: 'blob',
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateFileByIdTask = async (accesstoken, fileData) => {
    try {
        const formData = new FormData();
        formData.append('file', fileData.file); // Must be the actual file object
        formData.append('entityId', fileData.entityId);
        formData.append('entityType', fileData.entityType);
        formData.append('uploadedBy', fileData.uploadedBy);
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/file/upload-file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAttachmentByIdFile = async (accesstoken, attachmentId, updateData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/file/attachments/${attachmentId}`, updateData, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
