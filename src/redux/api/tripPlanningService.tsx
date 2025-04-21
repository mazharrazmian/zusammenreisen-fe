// tripService.js
import { API_URL, callAPi, callAPiMultiPart } from "./http-common";

export const tripService = {
  // Get all trips for the current user
  getUserTrips: async (filters = {}) => {
      const response = await callAPi.get(`${API_URL}/planner/trips`, { 
        params: filters,
      });
      return response
    
  },

  // Get a specific trip by ID
  getTripById: async (tripId) => {    
    const response = await callAPi.get(`${API_URL}/planner/trips/${tripId}`)
    return response;
    
  },

  // Remove trip participant
    removeTripParticipant: async (tripId, participantId) => {
        const response = await callAPi.post(`${API_URL}/planner/trips/${tripId}/remove_participant/`, {
            profile_id: participantId
        });
        return response;
    },

  getTripComments : async (tripId) => callAPi.get(`${API_URL}/planner/comments?post_id=${tripId}`),

  
  createComment : async (comment) => callAPiMultiPart.post(`${API_URL}/planner/comments/`,comment),

  deleteComment : async (commentId,tripId) => callAPi.delete(`${API_URL}/planner/comments/${commentId}?post_id=${tripId}`),

  // The Backend API gets 'next' as a complete url for next page. When the user clicks on it.
  // More comments are loaded. This way, pagination is completely done through backend.
  loadMoreComments : async (url : string) => callAPi.get(url) 

};

// messageService.js
export const messageService = {
  // Get messages for a trip
  getTripMessages: async (tripId, page = 1, limit = 50) => {
    try {
      const response = await axios.get(`${API_URL}/trips/${tripId}/messages`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trip messages:', error);
      throw error;
    }
  },

  // Send a new message
  sendMessage: async (tripId, message) => {
    try {
      const response = await axios.post(
        `${API_URL}/trips/${tripId}/messages`,
        message,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (tripId, messageId) => {
    try {
      const response = await axios.delete(`${API_URL}/trips/${tripId}/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Upload and attach a file to a message
  uploadFile: async (tripId, file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/trips/${tripId}/files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get all files for a trip
  getTripFiles: async (tripId) => {
    try {
      const response = await axios.get(`${API_URL}/trips/${tripId}/files`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trip files:', error);
      throw error;
    }
  },

  // Delete a file
  deleteFile: async (tripId, fileId) => {
    try {
      const response = await axios.delete(`${API_URL}/trips/${tripId}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};
