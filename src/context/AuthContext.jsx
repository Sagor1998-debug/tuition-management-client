import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

/* =========================
   FIREBASE CONFIG
========================= */
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

/* =========================
   CONTEXT
========================= */
export const AuthContext = createContext();

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* =========================
   PROVIDER
========================= */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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
     AUTH HANDLER
  ========================= */
  const handleSuccessfulAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
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
    const result = await signInWithPopup(auth, provider);
    const { displayName, email, photoURL } = result.user;

    const res = await api.post('/auth/google', {
      name: displayName,
      email,
      photoUrl: photoURL || 'https://i.imgur.com/0yQ9McP.png',
    });

    handleSuccessfulAuth(res.data.user, res.data.token);
    return res.data.user;
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
        api,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
