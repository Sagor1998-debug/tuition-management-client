import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tuitions from './pages/Tuitions';
import TuitionDetails from './pages/TuitionDetails';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <header className="bg-primary text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-7xl font-bold underline text-red-500">TuitionHub</h1>
          <nav className="space-x-6">
            <a href="/" className="hover:underline">Home</a>
            <a href="/tuitions" className="hover:underline">Tuitions</a>
            {user ? (
              <>
                <a href="/dashboard" className="hover:underline">Dashboard</a>
                <button onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }} className="btn btn-sm btn-error">Logout</button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:underline">Login</a>
                <a href="/register" className="hover:underline">Register</a>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tuitions" element={<Tuitions />} />
          <Route path="/tuitions/:id" element={<TuitionDetails />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-base-300 text-center p-4 mt-auto">
        <p>© 2025 TuitionHub - All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;