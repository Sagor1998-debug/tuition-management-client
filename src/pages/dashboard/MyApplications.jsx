import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/applications/my-applications') // tutor-specific endpoint
      .then(res => setApplications(res.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/applications/${id}`);
      toast.success('Application deleted');
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (err) {
      toast.error('Cannot delete approved application');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">My Applications</h2>
        {applications.map(app => (
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
        ))}
      </div>
    </DashboardLayout>
  );
}