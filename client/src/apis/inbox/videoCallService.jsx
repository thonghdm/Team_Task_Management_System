import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const videoCallService = {
  // Start a new video call
  startCall: async (accesstoken, participantIds, groupId = null) => {
    try {      
      // Đảm bảo participantIds là mảng
      if (!Array.isArray(participantIds)) {
        throw new Error('participantIds must be an array');
      }

      const response = await axios.post(
        `${API_URL}/calls`,
        { participantIds, groupId },
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error starting call:', error.response ? error.response.data : error.message);
      throw error;
    }
  },

  // Accept an incoming call
  acceptCall: async (accesstoken, callId) => {
    try {
      const response = await axios.put(
        `${API_URL}/calls/${callId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error accepting call:', error);
      throw error;
    }
  },

  // Decline an incoming call
  declineCall: async (accesstoken, callId) => {
    try {
      const response = await axios.put(
        `${API_URL}/calls/${callId}/decline`,
        {},
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error declining call:', error);
      throw error;
    }
  },

  // End an active call
  endCall: async (accesstoken, callId) => {
    try {
      const response = await axios.put(
        `${API_URL}/calls/${callId}/end`,
        {},
        {
          headers: { Authorization: `Bearer ${accesstoken}` },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  },

  // Get active call if exists
  getActiveCall: async (accesstoken) => {
    try {
      const response = await axios.get(`${API_URL}/calls/active`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { success: false, message: 'No active call' };
      }
      console.error('Error getting active call:', error);
      throw error;
    }
  },

  // Get call history
  getCallHistory: async (accesstoken) => {
    try {
      console.log(accesstoken);
      const response = await axios.get(`${API_URL}/calls/history`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting call history:', error);
      throw error;
    }
  },

  // Get call by ID
  getCallById: async (accesstoken, callId) => {
    try {
      const response = await axios.get(`${API_URL}/calls/${callId}`, {
        headers: { Authorization: `Bearer ${accesstoken}` },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Error getting call details:', error);
      throw error;
    }
  },
};

export default videoCallService;
