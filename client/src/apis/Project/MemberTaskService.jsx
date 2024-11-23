import axios from 'axios';

export const inviteMemberTask = async (accesstoken, data) => {
    try {     
        const response = await axios.post('http://localhost:5000/api/task/members', data, {
            headers: {
                Authorization: `Bearer ${accesstoken}` // Chú ý viết hoa "Authorization"
            },
            withCredentials: true
        });
        
        console.log('Response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error in inviteMemberTask:', error.response?.data || error);
        throw error;
    }
};
export const updateMemberTask = async (accesstoken, data) => {
    try {
        const response = await axios.put('http://localhost:5000/api/member-task/delete-member', data, {
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

export const getTaskByMemberID = async(accesstoken, memberID) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/member-task/tasks/${memberID}`, {
            headers: {
                Authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}