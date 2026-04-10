const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth APIs (No OTP)
export const authAPI = {
  register: (userData) => apiClient('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiClient('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
};

// Event APIs
export const eventAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient(`/events${queryString ? `?${queryString}` : ''}`);
  },
  
  getById: (id) => apiClient(`/events/${id}`),
  
  getFeatured: () => apiClient('/events/featured'),
  
  create: (eventData) => apiClient('/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  }),
  
  update: (id, eventData) => apiClient(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  }),
  
  delete: (id) => apiClient(`/events/${id}`, {
    method: 'DELETE',
  }),
};

// User APIs
export const userAPI = {
  getProfile: () => apiClient('/users/profile'),
  
  updateProfile: (data) => apiClient('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  getSavedEvents: () => apiClient('/users/saved-events'),
  
  saveEvent: (eventId) => apiClient('/users/saved-events', {
    method: 'POST',
    body: JSON.stringify({ eventId }),
  }),
  
  unsaveEvent: (eventId) => apiClient(`/users/saved-events/${eventId}`, {
    method: 'DELETE',
  }),
};

export default apiClient;
