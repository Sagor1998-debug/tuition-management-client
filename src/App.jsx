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
import Tutors from './pages/Tutors';  // NEW IMPORT
import About from './pages/About';   // NEW IMPORT
import Contact from './pages/Contact'; // NEW IMPORT

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
      <header className="bg-emerald-800 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          {/* LOGO + TEXT */}
          <div className="flex items-center space-x-4">
            <img 
              src="/src/assets/logo.jpg" 
              alt="TuitionHub Logo" 
              className="w-16 h-12 rounded-lg object-cover drop-shadow-2xl"
            />
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              TuitionHub
            </h1>
          </div>

          {/* NAVIGATION — DESKTOP */}
          <nav className="hidden md:flex items-center space-x-10 text-lg">
            <a href="/" className="hover:text-emerald-300 transition font-medium">Home</a>
            <a href="/tuitions" className="hover:text-emerald-300 transition font-medium">Tuitions</a>
            <a href="/tutors" className="hover:text-emerald-300 transition font-medium">Tutors</a>
            <a href="/about" className="hover:text-emerald-300 transition font-medium">About</a>
            <a href="/contact" className="hover:text-emerald-300 transition font-medium">Contact</a>
            
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photoUrl || "/src/assets/default-avatar.jpg"} alt="Profile" />
                  </div>
                </label>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black">
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <a href="/login" className="hover:text-emerald-300 transition font-medium">Login</a>
                <a href="/register" className="bg-white text-emerald-800 hover:bg-emerald-100 px-7 py-3 rounded-xl font-bold transition shadow-lg">
                  Register
                </a>
              </>
            )}
          </nav>

          {/* MOBILE MENU */}
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost text-3xl">
              ☰
            </label>
            <ul tabIndex={0} className="menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-black">
              <li><a href="/">Home</a></li>
              <li><a href="/tuitions">Tuitions</a></li>
              <li><a href="/tutors">Tutors</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              {user ? (
                <>
                  <li><a href="/dashboard">Dashboard</a></li>
                  <li>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/register">Register</a></li>
                </>
              )}
            </ul>
          </div>
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
          <Route path="/tutors" element={ <Tutors /> } />
          <Route path="/about" element={ <About /> } />
          <Route path="/contact" element={ <Contact /> } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-emerald-600 text-center p-4 mt-auto">
        <p>© 2025 TuitionHub - All rights reserved</p>
      </footer>
    </div>
  );
}

export default App;