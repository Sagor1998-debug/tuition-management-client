import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Common sidebar links based on role
  const getSidebarLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Manage Users', path: '/dashboard/users' },
        { name: 'Manage Tuitions', path: '/dashboard/tuitions' },
        { name: 'Reports', path: '/dashboard/reports' },
      ];
    } else if (user?.role === 'tutor') {
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Applications', path: '/dashboard/applications' },
        { name: 'Ongoing Tuitions', path: '/dashboard/ongoing' },
        { name: 'Revenue History', path: '/dashboard/revenue' },
      ];
    } else {
      // student
      return [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Tuitions', path: '/dashboard/my-tuitions' },
        { name: 'Applications', path: '/dashboard/applications' },
        { name: 'Payment History', path: '/dashboard/payments' },
      ];
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-teal-600 rounded-lg text-white flex flex-col">
        <div className="p-6 border-b border-emerald-700">
          <h2 className="text-2xl font-bold">TuitionHub</h2>
          <p className="text-emerald-300 text-sm mt-1">{user?.role?.toUpperCase()} PANEL</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getSidebarLinks().map((link) => (
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
          <h1 className="text-3xl font-bold text-emerald-800">Welcome, {user?.name || 'User'}</h1>
          <div className="avatar">
            <div className="w-12 rounded-full ring ring-emerald-600 ring-offset-base-100 ring-offset-2">
              <img src={user?.photoUrl || '/src/assets/default-avatar.jpg'} alt="Profile" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 bg-base-200">
          {children}
        </main>
      </div>
    </div>
  );
}