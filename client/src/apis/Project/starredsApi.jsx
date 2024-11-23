import axios from 'axios';

export const createNewStarred = async (accesstoken, data) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/starred/starred-project`, data, {
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

export const getStarred = async (accesstoken, memberId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/starred/starred-project/${memberId}`, {
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

export const updateStarred = async (accesstoken, data) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/starred/starred-project`, data, {
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