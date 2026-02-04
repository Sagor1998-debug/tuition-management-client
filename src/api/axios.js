import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // e.g., https://tuition-management-server.onrender.com/dev
  withCredentials: true, // if you need cookies/auth
  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
