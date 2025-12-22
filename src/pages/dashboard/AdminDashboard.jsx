import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios'; // ✅ shared axios instance

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingTuitions: 0,
    totalRevenue: 0,
    activeTutors: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, tuitionsRes, paymentsRes] = await Promise.all([
          api.get('/users/all'),
          api.get('/tuitions'),
          api.get('/payments/history')
        ]);

        const totalUsers = usersRes.data.length;
        const pendingTuitions = tuitionsRes.data.filter(post => post.status === 'pending').length;
        const activeTutors = usersRes.data.filter(user => user.role === 'tutor').length;
        const totalRevenue = paymentsRes.data.reduce((sum, p) => sum + p.amount, 0);

        setStats({ totalUsers, pendingTuitions, totalRevenue, activeTutors });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        toast.error('Failed to load admin stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        <p className="mt-4 text-xl">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-12">
        <h2 className="text-5xl font-bold text-center mb-10 text-error">Admin Panel</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="card bg-red-100 shadow-2xl hover:shadow-3xl transition">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
              <p className="text-5xl font-bold text-yellow-700 mt-4">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="card bg-red-100 shadow-2xl hover:shadow-3xl transition">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold text-gray-700">Pending Tuitions</h3>
              <p className="text-5xl font-bold text-orange-600 mt-4">
                {stats.pendingTuitions}
              </p>
            </div>
          </div>

          <div className="card bg-red-100 shadow-2xl hover:shadow-3xl transition">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-5xl font-bold text-success mt-4">
                ৳{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="card bg-red-100 shadow-2xl hover:shadow-3xl transition">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold text-gray-700">Active Tutors</h3>
              <p className="text-5xl font-bold text-pink-600 mt-4">
                {stats.activeTutors}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-x-6">
          <Link to="/dashboard/manage-users" className="btn btn-success btn-lg shadow-lg hover:shadow-2xl">
            Manage Users
          </Link>

          <Link to="/dashboard/approve-tuitions" className="bg-indigo-500 shadow-lg shadow-indigo-500/50 btn btn-error btn-lg shadow-lg hover:shadow-2xl">
            Approve Tuitions
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
