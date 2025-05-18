import axios from 'axios';
import { Complaint, ComplaintFilters } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => {
    console.log('Registering user:', userData);
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

export const complaints = {
  create: async (complaintData: FormData) => {
    const response = await api.post('/complaints', complaintData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getAll: async (filters?: ComplaintFilters) => {
    const response = await api.get('/complaints', { params: filters });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  
  updateStatus: async (id: string, status: Complaint['status']) => {
    const response = await api.patch(`/complaints/${id}/status`, { status });
    return response.data;
  },
  
  addResponse: async (id: string, message: string) => {
    const response = await api.post(`/complaints/${id}/response`, { message });
    return response.data;
  },
};

export const admin = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  
  getAllComplaints: async (filters?: ComplaintFilters) => {
    const response = await api.get('/admin/complaints', { params: filters });
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },
};

export default api;