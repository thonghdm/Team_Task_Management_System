import axios from 'axios';

export const createNewTask = async (accesstoken, taskData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/task/by-owner', taskData, {
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
        const response = await axios.get(`http://localhost:5000/api/task/tasks/${taskId}`, {
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
        const response = await axios.put('http://localhost:5000/api/task/members', data, {
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
        const response = await axios.put(`http://localhost:5000/api/task/tasks/${taskId}`, taskData, {
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



