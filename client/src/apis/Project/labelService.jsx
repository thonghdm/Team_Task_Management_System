import axios from 'axios';

export const createNewLabel = async (accesstoken, data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/label/labels`, data, {
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

export const updateLabel = async (accesstoken, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/label/labels`, data, {
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



