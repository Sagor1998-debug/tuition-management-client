import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS

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

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ← ADD THIS

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      api.get('/users/profile')
        .then(res => {
          setUser(res.data);
          // Optional: Redirect on page load if needed
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleSuccessfulAuth = (userData) => {
    setUser(userData);
    toast.success('Welcome back!');

    // ROLE-BASED REDIRECT
    if (userData.role === 'admin') {
      navigate('/dashboard'); // or '/admin-dashboard' if separate
    } else if (userData.role === 'tutor') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // student
    }
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
    handleSuccessfulAuth(res.data.user);
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
    handleSuccessfulAuth(res.data.user);
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = result.user;
      const res = await api.post('/auth/google', {
        name: displayName,
        email,
        photoUrl: photoURL || 'https://i.imgur.com/0yQ9McP.png'
      });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
      handleSuccessfulAuth(res.data.user);
    } catch (err) {
      console.error(err);
      toast.error('Google login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.Authorization;
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};