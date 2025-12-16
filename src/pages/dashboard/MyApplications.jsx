import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    const fetchApplications = async () => {
      const config = getAuthConfig();
      if (!config) return;

      try {
        const res = await axios.get(
          'http://localhost:5000/api/applications/my', // correct backend route
          config
        );
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

  const handleDelete = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    if (!window.confirm('Delete this application?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`, config);
      toast.success('Application deleted');
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      toast.error('Cannot delete approved application');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">My Applications</h2>
        {applications.length === 0 ? (
          <p>No applications yet</p>
        ) : (
          applications.map(app => (
            <div key={app._id} className="card bg-base-100 shadow-md mb-4">
              <div className="card-body">
                <h3 className="card-title">{app.tuition?.subject}</h3>
                <p>Status: <span className={`badge ${app.status === 'approved' ? 'badge-success' : 'badge-warning'}`}>{app.status}</span></p>
                <p>Expected Salary: ৳{app.expectedSalary}/month</p>
                {app.status === 'pending' && (
                  <div className="card-actions justify-end">
                    <button className="btn btn-sm btn-warning">Update</button>
                    <button onClick={() => handleDelete(app._id)} className="btn btn-sm btn-error">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
