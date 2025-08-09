import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfile = () => API.get('/users/me');
export const updateProfile = (data: { name?: string; password?: string }) =>
  API.post('/users/me', data);
