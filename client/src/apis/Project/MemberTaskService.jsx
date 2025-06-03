import axios from 'axios';

export const inviteMemberTask = async (accesstoken, data) => {
    try {     
        const response = await axios.post(`${import.meta.env.VITE_URL_SERVER}/api/task/members`, data, {
            headers: {
                Authorization: `Bearer ${accesstoken}` // Chú ý viết hoa "Authorization"
            },
            withCredentials: true
        });
        
        return response.data;
    } catch (error) {
        console.error('Error in inviteMemberTask:', error.response?.data || error);
        throw error;
    }
};
export const updateMemberTask = async (accesstoken, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_URL_SERVER}/api/member-task/delete-member`, data, {
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
        const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/member-task/tasks/${memberID}`, {
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