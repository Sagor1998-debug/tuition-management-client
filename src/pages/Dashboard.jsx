import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

export default function DashboardLayout({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const menuItems = {
    student: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'My Tuitions', path: '/dashboard/my-tuitions' },
      { name: 'Post New Tuition', path: '/dashboard/post-tuition' },
      { name: 'Applications', path: '/dashboard/applications' },
      { name: 'Payment History', path: '/dashboard/payments' },
      { name: 'Profile Settings', path: '/dashboard/profile' },
    ],
    tutor: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Active Tuitions', path: '/dashboard/active-tuitions' },
      { name: 'Find New Students', path: '/tuitions' },
      { name: 'Earnings', path: '/dashboard/earnings' },
      { name: 'Profile Settings', path: '/dashboard/profile' },
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Manage Users', path: '/dashboard/manage-users' },
      { name: 'Approve Tuitions', path: '/dashboard/approve-tuitions' },
      { name: 'Reports', path: '/dashboard/reports' },
    ]
  };

  const items = menuItems[user?.role] || menuItems.student;

  return (
    <div className="min-h-screen bg-base-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-emerald-800 text-white shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-10">
            {user?.role === 'admin' ? 'Admin Panel' :
             user?.role === 'tutor' ? 'Tutor Panel' :
             'Student Panel'}
          </h2>

          <nav className="space-y-2">
            {items.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-3 px-6 rounded-lg hover:bg-emerald-700 transition font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 w-full py-3 px-6 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}