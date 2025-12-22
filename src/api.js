// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tuition-management-server.onrender.com',
  withCredentials: true, 
});

export default api;
