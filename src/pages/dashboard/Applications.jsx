import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = () => {
    axios.get('http://localhost:5000/api/applications/my')
      .then(res => setApplications(res.data))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (applicationId) => {
    try {
      // Redirect to Stripe checkout (you'll integrate Stripe later)
      // For now, simulate redirect
      toast.success('Redirecting to payment...');
      // In real app: navigate to payment page with applicationId
      navigate(`/checkout/${applicationId}`); // placeholder route
    } catch (err) {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axios.patch(`http://localhost:5000/api/applications/${applicationId}/reject`);
      toast.success('Application rejected');
      loadApplications();
    } catch (err) {
      toast.error('Failed to reject');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Tutor Applications</h2>
        {loading ? (
          <div className="flex justify-center"><span className="loading loading-spinner loading-lg"></span></div>
        ) : applications.length === 0 ? (
          <p className="text-gray-600 text-center py-10">No applications yet.</p>
        ) : (
          <div className="grid gap-6">
            {applications.map(app => (
              <div key={app._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex items-start gap-6">
                    {/* Tutor Profile */}
                    <div className="avatar">
                      <div className="w-24 rounded-full ring ring-emerald-600 ring-offset-2">
                        <img src={app.tutor?.photoUrl || '/src/assets/default-avatar.jpg'} alt={app.tutor?.name} />
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{app.tutor?.name || 'Unknown Tutor'}</h3>
                      <p><strong>Qualifications:</strong> {app.tutor?.qualifications || 'Not provided'}</p>
                      <p><strong>Experience:</strong> {app.tutor?.experience || 'Not provided'}</p>
                      <p><strong>Expected Salary:</strong> ৳{app.expectedSalary || 'Not specified'}/month</p>
                      <p><strong>Message:</strong> {app.message || 'No message'}</p>
                      <p className="mt-2">
                        <span className={`badge ${app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                          {app.status}
                        </span>
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      {app.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(app._id)} 
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
                      {app.status === 'approved' && (
                        <span className="text-success font-bold">Approved</span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="text-error font-bold">Rejected</span>
                      )}
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