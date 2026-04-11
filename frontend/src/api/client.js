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

// Auth APIs
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
  
  getMyEvents: () => apiClient('/events/organizer/my-events'),
  
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

// Order APIs
export const orderAPI = {
  createCheckout: (items) => apiClient('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify({ items }),
  }),
  
  confirmPayment: (checkoutId) => apiClient(`/orders/${checkoutId}/confirm`, {
    method: 'POST',
  }),
  
  getMyOrders: () => apiClient('/orders/my-orders'),
  
  getOrderDetails: (orderId) => apiClient(`/orders/${orderId}`),
};

// Ticket APIs
export const ticketAPI = {
  getMyTickets: () => apiClient('/tickets/my-tickets'),
  
  downloadTicket: (ticketId) => apiClient(`/tickets/${ticketId}/download`),
  
  scanTicket: (ticketCode) => apiClient('/tickets/scan', {
    method: 'POST',
    body: JSON.stringify({ ticketCode }),
  }),
};

// Payment APIs
export const paymentAPI = {
  initPayment: (paymentData) => apiClient('/payments/init', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  
  verifyPayment: (tx_ref) => apiClient(`/payments/verify?tx_ref=${tx_ref}`),
  
  initPlatformFee: (feeData) => apiClient('/payments/platform-fee', {
    method: 'POST',
    body: JSON.stringify(feeData),
  }),
};

// Staff APIs
export const staffAPI = {
  createStaff: (staffData) => apiClient('/staff/create', {
    method: 'POST',
    body: JSON.stringify(staffData),
  }),
  
  getStaffMembers: () => apiClient('/staff/members'),
  
  getStaffDashboard: () => apiClient('/staff/dashboard'),
  
  scanTicket: (ticketCode) => apiClient('/staff/scan', {
    method: 'POST',
    body: JSON.stringify({ ticket_code: ticketCode }),
  }),
};

// Admin APIs
export const adminAPI = {
  getPendingOrganizers: () => apiClient('/admin/pending-organizers'),
  
  approveOrganizer: (userId) => apiClient(`/admin/approve/${userId}`, {
    method: 'PUT',
  }),
  
  rejectOrganizer: (userId, reason) => apiClient(`/admin/reject/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  }),
  
  getDashboardStats: () => apiClient('/admin/stats'),
};

// Review APIs
export const reviewAPI = {
  getEventReviews: (eventId) => apiClient(`/reviews/event/${eventId}`),
  
  addReview: (reviewData) => apiClient('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  
  addReply: (replyData) => apiClient('/reviews/reply', {
    method: 'POST',
    body: JSON.stringify(replyData),
  }),
};

// Notification APIs
export const notificationAPI = {
  getNotifications: () => apiClient('/notifications'),
  
  markAsRead: (notificationId) => apiClient(`/notifications/${notificationId}/read`, {
    method: 'PUT',
  }),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('authToken');
    
    return fetch(`${API_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
};

export default apiClient;
