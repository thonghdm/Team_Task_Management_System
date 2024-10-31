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
        console.error('Error creating task:', error.response?.data || error.message);
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
        console.error('Error getting task:', error.response?.data || error.message);
        throw error;
    }
}

export const inviteMemberTask = async (accesstoken, data) => {
    try {
        const response = await axios.post('http://localhost:5000/api/task/members', data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error.response?.data || error.message);
        throw error;
    }
};





