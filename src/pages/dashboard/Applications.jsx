import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // ✅ use shared axios instance

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Load user role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (!storedRole) {
      toast.error('User role not found, please login again');
      navigate('/login');
      return;
    }
    setRole(storedRole);
  }, [navigate]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Token missing, please login again');
      navigate('/login');
      return null;
    }
    return { headers: { 'x-auth-token': token } };
  };

  const loadApplications = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      let url = '';
      if (role === 'student') url = '/applications/my';
      else if (role === 'tutor') url = '/applications/my-applications';
      else {
        toast.error('Invalid role');
        return;
      }

      const res = await api.get(url, config);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role) loadApplications();
  }, [role]);

  // Reject application
  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;
    const config = getAuthConfig();
    if (!config) return;

    try {
      await api.patch(`/applications/${id}/reject`, {}, config);
      toast.success('Application rejected');
      loadApplications();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject application');
    }
  };

  // Accept & pay (Stripe checkout)
  const handleAccept = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      toast.loading('Redirecting to payment...');
      const res = await api.post('/payments/create-checkout-session', { applicationId: id }, config);
      toast.dismiss();
      window.location.href = res.data.url; // Stripe checkout
    } catch (err) {
      toast.dismiss();
      console.error(err);
      toast.error('Failed to start payment. Try again.');
    }
  };

  // Handle Stripe return success/cancel
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true') {
      toast.success('Payment successful! Tutor approved.');
      window.history.replaceState({}, '', '/dashboard/applications');
      loadApplications();
    }
    if (query.get('cancel') === 'true') {
      toast.error('Payment cancelled.');
      window.history.replaceState({}, '', '/dashboard/applications');
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Applications</h2>

        {loading ? (
          <div className="rounded-xl flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            {role === 'student'
              ? 'No tutor applications yet.'
              : 'You have not applied to any tuitions yet.'}
          </p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="card bg-base-100 shadow-md">
                <div className="card-body flex flex-col md:flex-row md:items-start gap-6">
                  {/* Tutor Info */}
                  {role === 'student' && (
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-emerald-600 ring-offset-2">
                        <img
                          src={app.tutor?.photoUrl || 'https://i.imgur.com/0yQ9McP.png'}
                          alt={app.tutor?.name}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex-1">
                    {role === 'student' && <h3 className="text-2xl font-bold">{app.tutor?.name}</h3>}
                    {role === 'tutor' && (
                      <h3 className="text-2xl font-bold">
                        {app.tuition?.subject} - Class {app.tuition?.class}
                      </h3>
                    )}

                    <p><strong>Location:</strong> {app.tuition?.location}</p>
                    <p><strong>Expected Salary:</strong> ৳{app.expectedSalary}/month</p>
                    <p><strong>Message:</strong> {app.message || 'No message'}</p>
                    <p className="mt-3">
                      <span
                        className={`badge ${
                          app.status === 'approved'
                            ? 'badge-success'
                            : app.status === 'rejected'
                            ? 'badge-error'
                            : 'badge-warning'
                        } badge-lg`}
                      >
                        {app.status}
                      </span>
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {role === 'student' && app.status === 'pending' && (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleAccept(app._id)}
                        className="bg-lime-700 text-white btn btn-success"
                      >
                        Accept & Pay
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-700 text-white btn btn-error btn-outline"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
