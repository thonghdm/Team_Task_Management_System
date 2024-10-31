import axios from 'axios';

export const createNewLabel = async (accesstoken, data) => {
    try {
        const response = await axios.post('http://localhost:5000/api/label/labels', data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating label:', error.response?.data || error.message);
        throw error;
    }
};



