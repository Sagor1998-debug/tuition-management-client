import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

export const AuthContext = createContext();

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load: fetch profile if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/users/profile')
        .then((res) => {
          setUser(res.data);
          // Save role and name to localStorage
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('name', res.data.name);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('name');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSuccessfulAuth = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    toast.success(`Welcome back, ${userData.name}!`);
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      handleSuccessfulAuth(res.data.user, res.data.token);
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post('/auth/register', data);
      handleSuccessfulAuth(res.data.user, res.data.token);
      return res.data.user;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      const res = await api.post('/auth/google', {
        name: displayName,
        email,
        photoUrl: photoURL || 'https://i.imgur.com/0yQ9McP.png',
      });
      handleSuccessfulAuth(res.data.user, res.data.token);
      return res.data.user;
    } catch (err) {
      console.error(err);
      toast.error('Google login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};
