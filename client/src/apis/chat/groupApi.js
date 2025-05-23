import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const groupApi = {
    // Create a new group
    createGroup: async (accessToken, name, description, memberIds, avatar = null) => {
        try {
            const response = await axios.post(
                `${API_URL}/groups/create`,
                { name, description, memberIds, avatar },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    },

    // Add a member to a group
    addMemberToGroup: async (accessToken, groupId, newMemberId) => {
        try {
            const response = await axios.post(
                `${API_URL}/groups/add-member`,
                { groupId, newMemberId },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error adding member to group:', error);
            throw error;
        }
    },

    // Remove a member from a group
    removeMemberFromGroup: async (accessToken, groupId, memberId) => {
        try {
            const response = await axios.post(
                `${API_URL}/groups/remove-member`,
                { groupId, memberId },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error removing member from group:', error);
            throw error;
        }
    },

    // Make a user an admin in a group
    makeGroupAdmin: async (accessToken, groupId, newAdminId) => {
        try {
            const response = await axios.post(
                `${API_URL}/groups/make-admin`,
                { groupId, newAdminId },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error making user admin:', error);
            throw error;
        }
    }
};

export default groupApi; 