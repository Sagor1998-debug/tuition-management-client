import { useContext, useState, useEffect, createContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios'; // <-- use shared axios instance

export const NotificationContext = createContext();

export default function DashboardLayout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSidebarLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Manage Users', path: '/dashboard/manage-users' },
        { name: 'Approve Tuitions', path: '/dashboard/approve-tuitions' },
        { name: 'Reports', path: '/dashboard/reports' },
      ];
    }

    if (user?.role === 'tutor') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Applications', path: '/dashboard/applications' },
        { name: 'Payment History', path: '/dashboard/payments' },
        { name: 'Profile Settings', path: '/dashboard/profile' },
      ];
    }

    return [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'My Tuitions', path: '/dashboard/my-tuitions' },
      { name: 'Post Tuition', path: '/dashboard/post-tuition' },
      { name: 'Applications', path: '/dashboard/applications' },
      { name: 'Payments', path: '/dashboard/payments' },
      { name: 'Profile', path: '/dashboard/profile' },
    ];
  };

  const sidebarLinks = getSidebarLinks();

  const loadNotifications = async () => {
    try {
      const res = await api.get('/tuitions/my'); // <-- use api instance
      const notif = res.data
        .filter(t => t.status === 'approved')
        .map(t => ({
          id: t._id,
          text: `Your tuition "${t.subject}" was approved`,
          read: false,
        }));

      setNotifications(notif);
      setUnreadCount(notif.filter(n => !n.read).length);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load notifications');
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount }}>
      <div className="min-h-screen bg-base-200 flex flex-col md:flex-row">

        {/* SIDEBAR */}
        <aside className="
          w-full
          md:w-64
          bg-teal-600
          text-white
          flex
          flex-col
          shrink-0
        ">
          <div className="p-6 border-b border-teal-700">
            <h2 className="text-2xl font-bold">eTuitionBd</h2>
            <p className="text-sm text-teal-200 mt-1">
              {user?.role?.toUpperCase()} PANEL
            </p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="block px-4 py-3 rounded-lg hover:bg-teal-700 transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-teal-700">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1 flex flex-col">

          {/* TOP BAR */}
          <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-emerald-800">
              Welcome, {user?.name || 'User'}
            </h1>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg z-50">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">
                      No notifications
                    </p>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                      >
                        {n.text}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-4 md:p-8 bg-base-200 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}
