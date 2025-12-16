import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingTuitions: 0,
    totalRevenue: 0,
    activeTutors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, tuitionsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users/all'),
          axios.get('http://localhost:5000/api/tuition-posts')
        ]);

        const totalUsers = usersRes.data.length;
        const pendingTuitions = tuitionsRes.data.filter(post => post.status === 'pending').length;
        const activeTutors = usersRes.data.filter(user => user.role === 'tutor').length;
        const totalRevenue = 345000; // Replace with real payment fetch when ready

        setStats({ totalUsers, pendingTuitions, totalRevenue, activeTutors });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-20"><span className="loading loading-spinner loading-lg"></span></div>;
  }

  return (
    <div className="text-center py-12">
      <h2 className="text-5xl font-bold mb-10 text-error">Admin Panel</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="card bg-red-100 shadow-2xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold">Total Users</h3>
            <p className="text-5xl font-bold text-yellow-700">{stats.totalUsers.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-red-100 shadow-2xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold">Pending Tuitions</h3>
            <p className="text-5xl font-bold text-orange-600">{stats.pendingTuitions}</p>
          </div>
        </div>

        <div className="card bg-red-100 shadow-2xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold">Total Revenue</h3>
            <p className="text-5xl font-bold text-success">৳{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-red-100 shadow-2xl">
          <div className="card-body">
            <h3 className="text-xl font-semibold">Active Tutors</h3>
            <p className="text-5xl font-bold text-pink-600">{stats.activeTutors}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 space-x-6">
        <Link to="/dashboard/manage-users" className="btn btn-success btn-lg">
          Manage Users
        </Link>

        <Link to="/dashboard/approve-tuitions" className="btn btn-error btn-lg">
          Approve Tuitions
        </Link>
      </div>
    </div>
  );
}