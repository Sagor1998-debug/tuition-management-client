import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Tuitions from './pages/Tuitions';
import TuitionDetails from './pages/TuitionDetails';
import NotFound from './pages/NotFound';
import Tutors from './pages/Tutors';
import TutorProfile from './pages/TutorProfile';
import About from './pages/About';
import Contact from './pages/Contact';

// Dashboard imports
import ManageUsers from './pages/dashboard/ManageUsers';
import ApproveTuitions from './pages/dashboard/ApproveTuitions';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TutorDashboard from './pages/dashboard/TutorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import MyTuitions from './pages/dashboard/MyTuitions';
import PostTuition from './pages/dashboard/PostTuition';
import Applications from './pages/dashboard/Applications';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import ProfileSettings from './pages/dashboard/ProfileSettings';
import Reports from './pages/dashboard/Reports';

function App() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setProfileOpen(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-rose-200">

      {/* ================= NAVBAR ================= */}
      <header className="bg-emerald-800 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-4">
            <img
              src="/src/assets/logo.jpg"
              alt="TuitionHub Logo"
              className="w-16 h-12 rounded-lg object-cover"
            />
            <h1 className="text-3xl font-extrabold">
              <span className="text-yellow-400">e</span>
              <span className="bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                Tuition
              </span>
              <span className="text-rose-400">Bd</span>
            </h1>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-8 font-medium">
            <Link to="/">Home</Link>
            <Link to="/tuitions">Tuitions</Link>
            <Link to="/tutors">Tutors</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3"
                >
                  <img
                    src={user.photoUrl || '/src/assets/default-avatar.jpg'}
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span>{user.name || 'Profile'}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white text-black rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full px-4 py-2 hover:bg-emerald-100 text-left"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 hover:bg-rose-100 text-left"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link
                  to="/register"
                  className="bg-white text-emerald-800 px-5 py-2 rounded-lg font-bold"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* MOBILE MENU */}
          <div className="md:hidden relative">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-3xl"
            >
              ☰
            </button>

            {mobileOpen && (
  <div className="absolute right-0 mt-3 w-72 bg-white text-black rounded-xl shadow-xl p-4">
    <div className="grid grid-cols-2 gap-3 text-sm font-medium">

      <Link onClick={() => setMobileOpen(false)} to="/" className="mobile-item">
        Home
      </Link>
      <Link onClick={() => setMobileOpen(false)} to="/tuitions" className="mobile-item">
        Tuitions
      </Link>
      <Link onClick={() => setMobileOpen(false)} to="/tutors" className="mobile-item">
        Tutors
      </Link>
      <Link onClick={() => setMobileOpen(false)} to="/about" className="mobile-item">
        About
      </Link>
      <Link onClick={() => setMobileOpen(false)} to="/contact" className="mobile-item">
        Contact
      </Link>

      {user ? (
        <>
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate('/dashboard');
            }}
            className="mobile-item"
          >
            Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="mobile-item text-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link onClick={() => setMobileOpen(false)} to="/login" className="mobile-item">
            Login
          </Link>
          <Link onClick={() => setMobileOpen(false)} to="/register" className="mobile-item font-semibold">
            Register
          </Link>
        </>
      )}
    </div>
  </div>
)}

          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow container mx-auto p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tuitions" element={<Tuitions />} />
          <Route path="/tuitions/:id" element={<TuitionDetails />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route
            path="/dashboard"
            element={
              user ? (
                user.role === 'admin' ? <AdminDashboard /> :
                user.role === 'tutor' ? <TutorDashboard /> :
                <StudentDashboard />
              ) : <Navigate to="/login" />
            }
          />

          <Route path="/dashboard/manage-users" element={<ManageUsers />} />
          <Route path="/dashboard/approve-tuitions" element={<ApproveTuitions />} />
          <Route path="/dashboard/post-tuition" element={<PostTuition />} />
          <Route path="/dashboard/my-tuitions" element={<MyTuitions />} />
          <Route path="/dashboard/applications" element={<Applications />} />
          <Route path="/dashboard/payments" element={<PaymentHistory />} />
          <Route path="/dashboard/profile" element={<ProfileSettings />} />
          <Route path="/dashboard/reports" element={<Reports />} />

          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* FOOTER (UNCHANGED) */}
      <footer className="bg-emerald-600 text-white py-6 text-center">
        © 2025 TuitionHub — All rights reserved.
      </footer>
    </div>
  );
}

export default App;
