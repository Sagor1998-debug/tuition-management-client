// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';
import { auth } from '../firebase'; // your Firebase config
import api from '../api/axios';
import { useNavigate } from 'react-router-dom'; // for redirect after login

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

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  /* =========================
     LOAD USER ON REFRESH
  ========================= */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);

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
    } else {
      setLoading(false);
    }
  }, []);

  /* =========================
     COMMON AUTH HANDLER
  ========================= */
  const handleSuccessfulAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    toast.success(`Welcome back, ${userData.name || 'User'}!`);
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
     GOOGLE LOGIN (using REDIRECT – fixes popup issues on Netlify)
  ========================= */
  const googleLogin = () => {
    // This triggers redirect to Google – no promise returned here
    signInWithRedirect(auth, provider);
  };

  // Handle the result when Google redirects back to your app
  useEffect(() => {
    const handleGoogleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (result?.user) {
          const { displayName, email, photoURL } = result.user;

          // Send data to your backend (same as before)
          const res = await api.post('/auth/google', {
            name: displayName,
            email,
            photoUrl: photoURL || 'https://i.imgur.com/0yQ9McP.png',
          });

          handleSuccessfulAuth(res.data.user, res.data.token);

          // Redirect to dashboard or home
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Google redirect login error:', error);
        toast.error('Google login failed. Please try again.');
      }
    };

    handleGoogleRedirectResult();
  }, [navigate]);

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