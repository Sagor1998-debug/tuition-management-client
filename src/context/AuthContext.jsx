// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api/axios';

/* =========================
   CONTEXT
========================= */
export const AuthContext = createContext();

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const provider = new GoogleAuthProvider();

  /* =========================
     LOAD USER ON REFRESH (FIXED)
  ========================= */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
    }

    // 🔑 ALWAYS try to load user via cookie
    api
      .get('/users/profile')
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name);
      })
      .catch(() => {
        localStorage.clear();
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     COMMON AUTH HANDLER
  ========================= */
  const handleSuccessfulAuth = (userData, jwtToken) => {
    setUser(userData);

    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem('token', jwtToken);
    }

    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);

    toast.success(`Welcome back, ${userData.name}!`);
  };

  /* =========================
     EMAIL LOGIN
  ========================= */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    handleSuccessfulAuth(res.data.user, res.data.token);
    return res.data.user;
  };

  /* =========================
     REGISTER
  ========================= */
  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    handleSuccessfulAuth(res.data.user, res.data.token);
    return res.data.user;
  };

  /* =========================
     GOOGLE LOGIN
  ========================= */
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
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed');
      throw error;
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        googleLogin,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
