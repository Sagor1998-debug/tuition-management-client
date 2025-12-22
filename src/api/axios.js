import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tuition-management-server.onrender.com/dev',
  
   // MUST include /api
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;




