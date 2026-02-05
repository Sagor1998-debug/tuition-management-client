import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://tuition-management-server.onrender.com/api
  withCredentials: true
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Token is OPTIONAL — cookie is primary in production
    const token = localStorage.getItem('token');

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
