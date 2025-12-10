import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/my');
      setApplications(res.data);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this application?')) return;

    try {
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}/reject`);
      toast.success('Application rejected');
      loadApplications(); // Refresh list
    } catch (err) {
      toast.error('Failed to reject application');
    }
  };

  const handleAccept = (applicationId) => {
    // Redirect to payment page (Stripe checkout)
    navigate(`/checkout/${applicationId}`);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Tutor Applications</h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : applications.length === 0 ? (
          <p className="text-center text-gray-600 py-10">No tutor applications yet.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-start gap-6">
                    {/* Tutor Photo */}
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-emerald-600 ring-offset-2">
                        <img
                          src={app.tutor?.photoUrl || '/src/assets/default-avatar.jpg'}
                          alt={app.tutor?.name}
                        />
                      </div>
                    </div>

                    {/* Tutor Info */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{app.tutor?.name || 'Unknown Tutor'}</h3>
                      <p><strong>Subject:</strong> {app.tuition?.subject} - Class {app.tuition?.class}</p>
                      <p><strong>Location:</strong> {app.tuition?.location}</p>
                      <p><strong>Expected Salary:</strong> ৳{app.expectedSalary}/month</p>
                      <p><strong>Message:</strong> {app.message || 'No message'}</p>
                      <p className="mt-3">
                        <span className={`badge ${
                          app.status === 'approved' ? 'badge-success' :
                          app.status === 'rejected' ? 'badge-error' :
                          'badge-warning'
                        } badge-lg`}>
                          {app.status}
                        </span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAccept(app._id)}
                            className="btn btn-success"
                          >
                            Accept & Pay
                          </button>
                          <button
                            onClick={() => handleReject(app._id)}
                            className="btn btn-error btn-outline"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'approved' && <span className="text-success font-bold">Approved</span>}
                      {app.status === 'rejected' && <span className="text-error font-bold">Rejected</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}