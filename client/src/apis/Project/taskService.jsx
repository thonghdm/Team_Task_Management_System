import axios from 'axios';

export const createNew = async (accesstoken, taskData) => {
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



