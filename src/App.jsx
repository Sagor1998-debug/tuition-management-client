import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tuitions from './pages/Tuitions';
import TuitionDetails from './pages/TuitionDetails';
import NotFound from './pages/NotFound';
import Tutors from './pages/Tutors';  
import About from './pages/About';   
import Contact from './pages/Contact'; 

// Dashboard imports
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TutorDashboard from './pages/dashboard/TutorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import MyTuitions from './pages/dashboard/MyTuitions';
import PostTuition from './pages/dashboard/PostTuition';
import Applications from './pages/dashboard/Applications';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import ProfileSettings from './pages/dashboard/ProfileSettings';

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
          
          {/* MAIN DASHBOARD - Role-based */}
          <Route path="/dashboard" element={
            user ? (
              user.role === 'admin' ? <AdminDashboard /> :
              user.role === 'tutor' ? <TutorDashboard /> :
              <StudentDashboard />
            ) : <Navigate to="/login" />
          } />

          {/* Student Dashboard Sub-Pages */}
          <Route path="/dashboard/my-tuitions" element={<MyTuitions />} />
          <Route path="/dashboard/post-tuition" element={<PostTuition />} />
          <Route path="/dashboard/applications" element={<Applications />} />
          <Route path="/dashboard/payments" element={<PaymentHistory />} />
          <Route path="/dashboard/profile" element={<ProfileSettings />} />

          <Route path="/tutors" element={<Tutors />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-emerald-600 text-white py-12 mt-auto">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            
            {/* About Platform */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-2xl font-bold mb-4 text-emerald-300">TuitionHub</h3>
              <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                TuitionHub is a trusted platform connecting students with qualified tutors across Bangladesh. 
                We ensure safe payments, verified tutors, and quality education for all subjects and levels.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-bold mb-4 text-emerald-300">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/tuitions" className="hover:text-white transition">Tuitions</a></li>
                <li><a href="/tutors" className="hover:text-white transition">Tutors</a></li>
                <li><a href="/about" className="hover:text-white transition">About</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-bold mb-4 text-emerald-300">Contact Us</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  support@tuitionhub.com
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  +880 123-456-789
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                  Dhaka, Bangladesh
                </li>
              </ul>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-xl font-bold mb-4 text-emerald-300">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-white text-emerald-800 p-3 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" className="bg-white text-black p-3 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" className="bg-white text-emerald-800 p-3 rounded-full hover:bg-gray-200 transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Section - Always Centered */}
          <div className="border-t border-emerald-700 mt-10 pt-6 text-center text-gray-400 text-sm">
            <p>© 2025 TuitionHub - All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;