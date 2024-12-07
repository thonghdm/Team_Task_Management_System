import axios from 'axios';

export const createNewList = async (accesstoken, listData) => {
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


export const updateList = async (accesstoken,listId, listData) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/list/lists/${listId}`, listData, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating list:', error.response?.data || error.message);
        throw error;
    }
}



