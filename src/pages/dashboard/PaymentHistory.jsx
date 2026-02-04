import DashboardLayout from '../../layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/payments/history');
        if (!Array.isArray(res.data)) throw new Error('Invalid API response');
        setPayments(res.data);
      } catch (err) {
        console.error('Failed to load payments:', err);
        setError('Failed to load payment history.');
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Payment History</h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center">{error}</p>
        ) : payments.length === 0 ? (
          <div className="alert alert-info">
            <span>Your payment history will appear here after hiring tutors.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tutor</th>
                  <th>Tuition</th>
                  <th>Amount (৳)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>{p.tutor?.name || 'N/A'}</td>
                    <td>{p.tuition?.subject || 'N/A'}</td>
                    <td>{p.amount.toLocaleString()}</td>
                    <td className={`font-bold ${p.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {p.status}
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
