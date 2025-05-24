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
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
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
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
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
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
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
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Remove a group admin
    removeGroupAdmin: async (accessToken, groupId, adminId) => {
        try {
            const response = await axios.post(
                `${API_URL}/groups/remove-admin`,
                { groupId, adminId },
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },
    
    // Update group avatar
    updateGroupAvatar: async (accessToken, groupId, avatarFile) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            formData.append('groupId', groupId);
            
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            
            const response = await axios.put(
                `${API_URL}/groups/update-avatar`,
                formData,
                {
                    headers: { 
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default groupApi; 