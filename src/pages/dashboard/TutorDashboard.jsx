import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TutorDashboard() {
  const [stats, setStats] = useState({
    activeTuitions: 0,
    totalEarnings: 0,
    rating: 4.8
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [appsRes, paymentsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/applications/tutor', config),
          axios.get('http://localhost:5000/api/payments/history', config)
        ]);

        const approved = appsRes.data.filter(app => app.status === 'approved');
        const totalEarnings = paymentsRes.data.reduce((sum, p) => sum + p.amount, 0);

        setStats({
          activeTuitions: approved.length,
          totalEarnings,
          rating: 4.8 // or calculate from reviews later
        });
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="py-12">
      <h2 className="text-5xl font-bold text-center mb-10">Tutor Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h3 className="text-xl">Active Tuitions</h3>
            <p className="text-5xl font-bold text-emerald-600">{stats.activeTuitions}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h3 className="text-xl">Total Earnings</h3>
            <p className="text-5xl font-bold text-emerald-600">৳{stats.totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <h3 className="text-xl">Rating</h3>
            <p className="text-5xl font-bold text-yellow-500">{stats.rating} ⭐</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/tuitions" className="btn btn-success btn-lg px-12">
          Find New Students
        </Link>
      </div>
    </div>
  );
}