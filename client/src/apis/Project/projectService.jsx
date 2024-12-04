import axios from 'axios';

export const getAllByOwnerId = async (accesstoken, ownerId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project/by-owner?ownerId=${ownerId}`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getAllByMemberId = async (accesstoken, memberId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project/by-member?memberId=${memberId}`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProjectDetal = async (accesstoken, projectId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project/${projectId}`, {
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

export const createNew = async (accesstoken, projectData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/project/by-owner', projectData, {
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

export const updateProject = async (accesstoken, projectId, projectData) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/project/${projectId}`, projectData, {
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


export const moveCardTodifferentColumn = async (accesstoken, data) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/project/move-task`, data, {
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


export const getAllProjects = async (accesstoken) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project/all-projects`, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};





