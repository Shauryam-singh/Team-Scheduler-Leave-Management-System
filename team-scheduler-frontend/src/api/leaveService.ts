import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchLeaves = () => API.get('/leaves');
export const createLeave = (data: any) => API.post('/leaves', data);
