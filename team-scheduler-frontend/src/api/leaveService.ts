import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createLeave = (data: { reason: string; startDate: string; endDate: string }) =>
  API.post('/leaves', data);

export const getLeaves = () => API.get('/leaves');
