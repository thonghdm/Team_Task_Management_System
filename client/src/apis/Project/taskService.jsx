import axios from 'axios';

export const createNewTask = async (accesstoken, taskData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/task/by-owner`, taskData, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTasksById = async (accesstoken, taskId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/task/tasks/${taskId}`, {
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



export const updateMemberTask = async (accesstoken, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/task/members`, data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (accesstoken, taskId, taskData) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/task/tasks/${taskId}`, taskData, {
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



