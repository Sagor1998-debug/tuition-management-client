import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import api from '../../api/axios'; // centralized axios instance
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to get auth headers
  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login again');
      return null;
    }
    return { headers: { 'x-auth-token': token } };
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      const config = getAuthConfig();
      if (!config) return setLoading(false);

      try {
        const res = await api.get('/applications/my', config);
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Delete application
  const handleDelete = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    if (!window.confirm('Delete this application?')) return;

    try {
      await api.delete(`/applications/${id}`, config);
      setApplications(prev => prev.filter(app => app._id !== id));
      toast.success('Application deleted');
    } catch (err) {
      console.error(err);
      toast.error('Cannot delete approved application');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
          <p className="mt-4 text-xl">Loading your applications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">My Applications</h2>

        {applications.length === 0 ? (
          <p className="text-center text-gray-600 py-10">You have not applied to any tuitions yet.</p>
        ) : (
          <div className="space-y-6">
            {applications.map(app => (
              <div key={app._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h3 className="card-title text-xl font-bold">{app.tuition?.subject}</h3>
                  <p>
                    Status: <span className={`badge ${app.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{app.status}</span>
                  </p>
                  <p>Expected Salary: ৳{app.expectedSalary}/month</p>
                  {app.status === 'pending' && (
                    <div className="card-actions justify-end mt-4 space-x-2">
                      <button className="btn btn-sm btn-warning">Update</button>
                      <button onClick={() => handleDelete(app._id)} className="btn btn-sm btn-error">Delete</button>
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
