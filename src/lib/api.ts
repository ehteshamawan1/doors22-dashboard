/**
 * API Client for Doors22 Backend
 */

import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== TRENDS API =====
export const trendsApi = {
  getAll: async (params?: { limit?: number; date?: string }) => {
    const response = await apiClient.get('/api/trends', { params });
    return response.data;
  },

  getLatest: async () => {
    const response = await apiClient.get('/api/trends/latest');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/trends/${id}`);
    return response.data;
  },

  analyze: async (includeVideos = true) => {
    const response = await apiClient.post('/api/trends/analyze', { includeVideos });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/trends/${id}`);
    return response.data;
  },
};

// ===== CONTENT API =====
export const contentApi = {
  getAll: async (params?: { type?: string; limit?: number; status?: string }) => {
    const response = await apiClient.get('/api/content', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/content/${id}`);
    return response.data;
  },

  generate: async (data?: { type?: string; concept?: string }) => {
    const response = await apiClient.post('/api/content/generate', data);
    return response.data;
  },
};

// ===== POSTS API =====
export const postsApi = {
  getAll: async (params?: { status?: string; type?: string; limit?: number }) => {
    const response = await apiClient.get('/api/posts', { params });
    return response.data;
  },

  getPending: async (limit?: number) => {
    const response = await apiClient.get('/api/posts/pending', { params: { limit } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/posts/${id}`);
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/api/posts/statistics');
    return response.data;
  },

  getHistory: async (id: string) => {
    const response = await apiClient.get(`/api/posts/${id}/history`);
    return response.data;
  },

  approve: async (id: string, data?: { approvedBy?: string; scheduledPostTime?: string }) => {
    const response = await apiClient.put(`/api/posts/${id}/approve`, data);
    return response.data;
  },

  reject: async (id: string, data: { reason: string; rejectedBy?: string }) => {
    const response = await apiClient.put(`/api/posts/${id}/reject`, data);
    return response.data;
  },

  edit: async (id: string, updates: any, editedBy?: string) => {
    const response = await apiClient.put(`/api/posts/${id}/edit`, { updates, editedBy });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/posts/${id}`);
    return response.data;
  },
};

// ===== INTERACTIONS API (Comments & DMs) =====
export const interactionsApi = {
  getAll: async (params?: { platform?: string; type?: string; category?: string; limit?: number }) => {
    const response = await apiClient.get('/api/interactions', { params });
    return response.data;
  },

  getStatistics: async () => {
    const response = await apiClient.get('/api/interactions/statistics');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/api/interactions/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/interactions/${id}`);
    return response.data;
  },
};

// ===== HEALTH CHECK =====
export const healthApi = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
};

export default apiClient;
