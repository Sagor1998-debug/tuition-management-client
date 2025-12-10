import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Reports() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    totalTuitions: 0,
    totalStudents: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    monthlyEarnings: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/reports')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  // Chart Data
  const monthlyData = {
    labels: stats.monthlyEarnings.map(m => m._id),
    datasets: [
      {
        label: 'Monthly Earnings (BDT)',
        data: stats.monthlyEarnings.map(m => m.earnings),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4
      }
    ]
  };

  const roleData = {
    labels: ['Students', 'Tutors'],
    datasets: [
      {
        label: 'User Distribution',
        data: [stats.totalStudents, stats.totalTutors],
        backgroundColor: ['#3b82f6', '#8b5cf6'],
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold mb-10 text-emerald-800 text-center">Reports & Analytics</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <div className="bg-emerald-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-emerald-800">৳{stats.totalEarnings.toLocaleString()}</h3>
                <p className="text-gray-700 mt-3 text-xl">Total Platform Earnings</p>
              </div>
              <div className="bg-blue-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-blue-800">{stats.totalTransactions}</h3>
                <p className="text-gray-700 mt-3 text-xl">Total Transactions</p>
              </div>
              <div className="bg-purple-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-purple-800">{stats.pendingTuitions}</h3>
                <p className="text-gray-700 mt-3 text-xl">Pending Tuitions</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-base-100 p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-emerald-800">Monthly Earnings Trend</h3>
                <Line data={monthlyData} options={{ responsive: true }} />
              </div>
              <div className="bg-base-100 p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold mb-4 text-emerald-800">User Distribution</h3>
                <Pie data={roleData} options={{ responsive: true }} />
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-base-100 rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold mb-6 text-emerald-800">Recent Transactions</h3>
              {stats.recentTransactions.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No transactions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Tutor</th>
                        <th>Tuition</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTransactions.map(tx => (
                        <tr key={tx._id}>
                          <td>{new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}</td>
                          <td>{tx.student?.name || 'N/A'}</td>
                          <td>{tx.tutor?.name || 'N/A'}</td>
                          <td>{tx.tuition?.subject || 'N/A'}</td>
                          <td className="font-bold text-emerald-600">৳{tx.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}