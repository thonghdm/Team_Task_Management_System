import axios from 'axios';


const groupApi = {
    // Create a new group
    createGroup: async (accessToken, name, description, memberIds, avatar = null) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL_SERVER}/api/groups/create`,
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
                `${import.meta.env.VITE_URL_SERVER}/api/groups/add-member`,
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
                `${import.meta.env.VITE_URL_SERVER}/api/groups/remove-member`,
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
                `${import.meta.env.VITE_URL_SERVER}/api/groups/make-admin`,
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
                `${import.meta.env.VITE_URL_SERVER}/api/groups/remove-admin`,
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
                `${import.meta.env.VITE_URL_SERVER}/api/groups/update-avatar`,
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