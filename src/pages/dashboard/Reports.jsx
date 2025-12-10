import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
                <h3 className="text-5xl font-bold text-purple-800">
                  ৳{(stats.totalEarnings / (stats.totalTransactions || 1)).toFixed(0)}
                </h3>
                <p className="text-gray-700 mt-3 text-xl">Avg. Transaction Value</p>
              </div>
              <div className="bg-yellow-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-yellow-800">{stats.totalTuitions}</h3>
                <p className="text-gray-700 mt-3 text-xl">Total Tuitions</p>
              </div>
              <div className="bg-indigo-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-indigo-800">{stats.totalStudents}</h3>
                <p className="text-gray-700 mt-3 text-xl">Total Students</p>
              </div>
              <div className="bg-pink-100 p-8 rounded-xl text-center shadow-md">
                <h3 className="text-5xl font-bold text-pink-800">{stats.totalTutors}</h3>
                <p className="text-gray-700 mt-3 text-xl">Total Tutors</p>
              </div>
            </div>

            {/* Transaction History Table */}
            <div className="bg-base-100 rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold mb-6 text-em earm-800">Transaction History</h3>
              {stats.recentTransactions.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No transactions recorded yet.</p>
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
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentTransactions.map(tx => (
                        <tr key={tx._id}>
                          <td>{new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}</td>
                          <td>{tx.student?.name || 'N/A'}</td>
                          <td>{tx.tutor?.name || 'N/A'}</td>
                          <td>{tx.tuition?.subject || 'N/A'} {tx.tuition?.class ? `- Class ${tx.tuition.class}` : ''}</td>
                          <td className="font-bold text-emerald-600">৳{tx.amount}</td>
                          <td><span className="badge badge-success">Success</span></td>
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