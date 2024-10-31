import axios from 'axios';

export const createNewComment = async (accesstoken, data) => {
    try {
        const response = await axios.post('http://localhost:5000/api/comment/comments', data, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error.response?.data || error.message);
        throw error;
    }
};
export const getCommentById = async (accesstoken, taskId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/comment/comments${taskId}`, {
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