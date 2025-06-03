import axios from "axios";

export const getAuditLog = async (accesstoken, taskId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/auditLog/auditLogs/${taskId}`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const createNewAuditLog = async (accesstoken, data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auditLog/auditLogs`, data, {
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
export const createNewAuditLog_project = async (accesstoken, data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/auditLog/auditLogs_project`, data, {
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
export const getAuditLog_project = async (accesstoken, projectId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/auditLog/auditLogs_project/${projectId}`, {
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
