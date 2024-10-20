import axios from 'axios';

export const getAllByOwnerId = async (ownerId) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/project?ownerId=${ownerId}`, {
            withCredentials: true
        }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error.response?.data || error.message);
        throw error;
    }
};


export const createNew = async (projectData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/project', projectData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error.response?.data || error.message);
        throw error;
    }
};

