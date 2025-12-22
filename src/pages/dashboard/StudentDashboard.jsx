import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios'; // Using api instance

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    myTuitions: 0,
    applications: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [tuitionsRes, appsRes, paymentsRes] = await Promise.all([
          api.get('/tuitions/my', config),
          api.get('/applications/my', config),
          api.get('/payments/history', config)
        ]);

        const totalSpent = paymentsRes.data.reduce((sum, p) => sum + p.amount, 0);

        setStats({
          myTuitions: tuitionsRes.data.length,
          applications: appsRes.data.length,
          totalSpent
        });
      } catch (err) {
        console.error('Failed to fetch student stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center py-20">Loading dashboard...</p>;

  return (
    <div className="py-12">
      <h2 className="text-5xl font-bold text-center mb-10">Student Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="rounded-xl h-32 card bg-blue-500 shadow-lg shadow-blue-500/50 shadow-xl">
          <div className="card-body text-center">
            <h3 className="mt-6 text-xl">My Tuitions</h3>
            <p className="text-5xl font-bold text-purple-600">{stats.myTuitions}</p>
          </div>
        </div>

        <div className="rounded-xl h-32 card bg-blue-500 shadow-lg shadow-blue-500/50 shadow-xl">
          <div className="card-body text-center">
            <h3 className="mt-6 text-xl">Applications</h3>
            <p className="text-5xl font-bold text-pink-600">{stats.applications}</p>
          </div>
        </div>

        <div className="rounded-xl h-32 card bg-blue-500 shadow-lg shadow-blue-500/50 shadow-xl">
          <div className="card-body text-center">
            <h3 className="mt-6 text-xl">Total Spent</h3>
            <p className="text-5xl font-bold text-yellow-600">৳{stats.totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/dashboard/post-tuition"
          className="bg-blue-500 shadow-lg shadow-blue-500/50 btn btn-primary btn-lg px-12"
        >
          Post New Tuition
        </Link>
      </div>
    </div>
  );
}
