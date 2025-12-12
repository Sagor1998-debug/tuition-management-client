import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Role-based sidebar links
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
      // Student
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

  // Sample notifications
  const notifications = [
    { id: 1, text: "New application from Md. Rahman", time: "2 mins ago", type: "application" },
    { id: 2, text: "Payment received: ৳8,000", time: "1 hour ago", type: "payment" },
    { id: 3, text: "Your tuition was approved", time: "Yesterday", type: "success" },
  ];

  const unreadCount = notifications.length;

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-teal-600 text-white flex flex-col">
        <div className="p-6 border-b border-emerald-700">
          <h2 className="text-2xl font-bold">TuitionHub</h2>
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
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-800">
            Welcome, {user?.name || 'User'}
          </h1>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle relative cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="badge badge-error badge-sm indicator-item">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
              </label>

              {/* Notification Dropdown */}
              {showNotifications && (
                <ul
                  tabIndex={0}
                  className="menu menu-md dropdown-content mt-3 z-50 p-4 shadow bg-base-100 rounded-box w-96"
                  onBlur={() => setShowNotifications(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-bold">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <li className="p-4 text-center text-gray-500">No new notifications</li>
                  ) : (
                    notifications.map((notif) => (
                      <li key={notif.id} className="border-b border-gray-100 last:border-0">
                        <a className="block px-4 py-4 hover:bg-gray-50 transition">
                          <div className="flex items-center gap-3">
                            {notif.type === 'application' && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            )}
                            {notif.type === 'payment' && (
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            )}
                            {notif.type === 'success' && (
                              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))
                  )}
                  <div className="p-3 text-center">
                    <button className="text-sm text-emerald-600 hover:underline">
                      View all notifications
                    </button>
                  </div>
                </ul>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-emerald-600 ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoUrl || '/src/assets/default-avatar.jpg'}
                  alt="Profile"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-base-200 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}