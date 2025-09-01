// API service layer for GlowKart Hub
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Don't set Content-Type for FormData, let browser set it with boundary
  const isFormData = options.body instanceof FormData;
  
  // Auto-attach Authorization header from localStorage token when present
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
  const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    // Some endpoints (like file upload) may not return JSON
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (error) {
    console.error(`API request failed: ${error}`);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: { name: string; email: string; password: string; role: string }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};

// Product API functions
export const productAPI = {
  getAllProducts: async () => {
    return apiRequest('/api/products');
  },
  
  getProductsByStore: async (storeId: string) => {
    return apiRequest(`/api/products/store/${storeId}`);
  },
  
  getProductById: async (productId: string) => {
    return apiRequest(`/api/products/${productId}`);
  },
  
  createProduct: async (productData: any, token: string) => {
    return apiRequest('/api/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
  },
  
  uploadProductImage: async (imageFile: File, token: string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiRequest('/api/upload/product-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
  },
};

// Order API functions
export const orderAPI = {
  createOrder: async (orderData: any, token: string) => {
    return apiRequest('/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
  },
  
  getUserOrders: async (token: string) => {
    return apiRequest('/api/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  getOrderById: async (orderId: string, token: string) => {
    return apiRequest(`/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  updateOrderStatus: async (orderId: string, status: string, trackingUpdate: any, token: string) => {
    return apiRequest(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, trackingUpdate }),
    });
  },
  
  addTrackingInfo: async (orderId: string, trackingData: any, token: string) => {
    return apiRequest(`/api/orders/${orderId}/tracking`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingData),
    });
  },
};

// Product Review API functions
export const productReviewAPI = {
  addReview: async (productId: string, reviewData: { rating: number; comment: string }, token: string) => {
    return apiRequest(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
  },
  
  updateReview: async (productId: string, reviewData: { rating: number; comment: string }, token: string) => {
    return apiRequest(`/api/products/${productId}/reviews`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
  },
  
  deleteReview: async (productId: string, token: string) => {
    return apiRequest(`/api/products/${productId}/reviews`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// User API functions
export const userAPI = {
  getCurrentUser: async (token: string) => {
    return apiRequest('/api/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  updateProfile: async (profileData: any, token: string) => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  },
};

// Store Review API functions
export const storeReviewAPI = {
  addReview: async (storeId: string, reviewData: { rating: number; comment: string }, token: string) => {
    return apiRequest(`/api/stores/${storeId}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
  },
  
  updateReview: async (storeId: string, reviewData: { rating: number; comment: string }, token: string) => {
    return apiRequest(`/api/stores/${storeId}/reviews`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
  },
  
  deleteReview: async (storeId: string, token: string) => {
    return apiRequest(`/api/stores/${storeId}/reviews`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Admin Review API functions
export const adminReviewAPI = {
  getAllProductReviews: async (token: string) => {
    return apiRequest('/api/admin/reviews/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  getAllStoreReviews: async (token: string) => {
    return apiRequest('/api/admin/reviews/stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  deleteProductReview: async (productId: string, reviewId: string, token: string) => {
    return apiRequest(`/api/admin/reviews/products/${productId}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  
  deleteStoreReview: async (storeId: string, reviewId: string, token: string) => {
    return apiRequest(`/api/admin/reviews/stores/${storeId}/${reviewId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Store Analytics API functions
export const storeAnalyticsAPI = {
  getStoreAnalytics: async (storeId: string, token: string) => {
    return apiRequest(`/api/stores/${storeId}/analytics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Admin API functions
export const adminAPI = {
  getDashboardStats: async (token: string) => {
    return apiRequest('/api/admin/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  getAllUsers: async (token: string) => {
    return apiRequest('/api/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  getAllStores: async (token: string) => {
    return apiRequest('/api/admin/stores', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  getAllProducts: async (token: string) => {
    return apiRequest('/api/admin/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  updateProduct: async (productId: string, productData: any, token: string) => {
    return apiRequest(`/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
  },
  deleteProduct: async (productId: string, token: string) => {
    return apiRequest(`/api/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
  getAllOrders: async (token: string) => {
    return apiRequest('/api/admin/orders', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  },
};

// Store API functions
export const storeAPI = {
  getAllStores: async (page: number = 1, limit: number = 10) => {
    return apiRequest(`/api/stores?page=${page}&limit=${limit}`);
  },
  
  getStoreById: async (id: string) => {
    return apiRequest(`/api/stores/${id}`);
  },
  
  createStore: async (storeData: any, token: string) => {
    return apiRequest('/api/stores', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: storeData, // storeData can be FormData or JSON
    });
  },
};