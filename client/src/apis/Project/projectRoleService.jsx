import axios from 'axios';

export const inviteMember = async (accesstoken, inviteData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/project-role/member', inviteData, {
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


export const getMemberProject = async (accesstoken, projectId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project-role/member/${projectId}`, {
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


export const deleteMemberProject = async (accesstoken, data) => {
    try {
        const response = await axios.put('http://localhost:5000/api/project-role/member', data, {
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

export const updateMemberRole = async (accesstoken, data, roleId) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/project-role/member/${roleId}`, data, {
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

