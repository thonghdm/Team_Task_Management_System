import axios from 'axios';

export const getAllByOwnerId = async (accesstoken,ownerId) => {
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
        console.error('Error fetching projects:', error.response?.data || error.message);
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
        console.error('Error fetching project data:', error.message);
        throw error;
    }
};

export const createNew = async (accesstoken,projectData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/project/by-owner', projectData, {
            headers: {
                authorization: `Bearer ${accesstoken}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error.response?.data || error.message);
        throw error;
    }
};


