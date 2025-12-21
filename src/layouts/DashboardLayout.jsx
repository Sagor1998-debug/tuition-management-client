import { useContext, useState, useEffect, createContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getSidebarLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Manage Users', path: '/dashboard/users' },
        { name: 'Manage Tuitions', path: '/dashboard/tuitions' },
        { name: 'Reports & Analytics', path: '/dashboard/reports' },
      ];
    } else if (user?.role === 'tutor') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Applications', path: '/dashboard/applications' },
        { name: 'Ongoing Tuitions', path: '/dashboard/ongoing' },
        { name: 'Revenue History', path: '/dashboard/revenue' },
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Tuitions', path: '/dashboard/my-tuitions' },
        { name: 'Post New Tuition', path: '/dashboard/post-tuition' },
        { name: 'Applied Tutors', path: '/dashboard/applications' },
        { name: 'Payment History', path: '/dashboard/payments' },
        { name: 'Profile Settings', path: '/dashboard/profile' },
        { name: 'Class Calendar', path: '/dashboard/calendar' },
      ];
    }
  };

  const sidebarLinks = getSidebarLinks();

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      const res = await axios.get(
        'http://localhost:5000/api/tuitions/my',
        config
      );

      const notif = res.data
        .filter((t) => t.status === 'approved')
        .map((t) => ({
          id: t._id,
          text: `Your tuition "${t.subject}" was approved`,
          time: 'Just now',
          type: 'success',
          read: false,
        }));

      setNotifications(notif);
      setUnreadCount(notif.length);
    } catch {
      toast.error('Failed to load notifications');
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount }}>
      {/* 🔧 ONLY CHANGE: flex-col on small, flex-row on md */}
      <div className="min-h-screen bg-base-200 flex flex-col md:flex-row">

        {/* SIDEBAR */}
        <div className="w-full md:w-64 bg-teal-600 text-white flex flex-col">
          <div className="p-6 border-b border-emerald-700">
            <h2 className="text-2xl font-bold">eTuitionBd</h2>
            <p className="text-emerald-300 text-sm mt-1">
              {user?.role ? user.role.toUpperCase() + ' PANEL' : 'DASHBOARD'}
            </p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block py-3 px-4 rounded-lg hover:bg-emerald-700 transition font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-emerald-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white shadow-sm px-4 md:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-3xl font-bold text-emerald-800 truncate">
              Welcome, {user?.name || 'User'}
            </h1>

            <div className="avatar">
              <div className="w-10 md:w-12 rounded-full ring ring-emerald-600 ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoUrl || '/src/assets/default-avatar.jpg'}
                  alt="Profile"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 bg-base-200 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}
