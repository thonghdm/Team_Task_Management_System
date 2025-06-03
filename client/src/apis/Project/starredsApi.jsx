import axios from 'axios';

export const createNewStarred = async (accesstoken, data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/starred/starred-project`, data, {
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
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/starred/starred-project/${memberId}`, {
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
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/starred/starred-project`, data, {
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