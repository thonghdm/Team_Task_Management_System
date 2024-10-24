import axios from 'axios';

export const createNew = async (accesstoken, listData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/list/by-owner', listData, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating list:', error.response?.data || error.message);
        throw error;
    }
};



