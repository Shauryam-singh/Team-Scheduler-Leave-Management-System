import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const register = (data: { name: string; email: string; password: string }) =>
  API.post('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);
