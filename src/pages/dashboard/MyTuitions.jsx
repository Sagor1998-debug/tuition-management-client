import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios'; // <-- use api instance

export default function MyTuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadTuitions();
  }, []);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login again');
      navigate('/login');
      return null;
    }
    return {
      headers: {
        'x-auth-token': token
      }
    };
  };

  const loadTuitions = async () => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      const res = await api.get('/tuitions/my', config);
      setTuitions(res.data);
    } catch (err) {
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const config = getAuthConfig();
    if (!config) return;

    try {
      await api.delete(`/tuitions/${id}`, config);
      toast.success('Tuition deleted successfully');
      loadTuitions(); // refresh list
    } catch (err) {
      toast.error('Failed to delete');
    }
    setShowConfirm(null);
  };

  const handleEdit = (tuition) => {
    navigate('/dashboard/post-tuition', { state: tuition });
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-emerald-800">
            My Tuitions
          </h2>

          <Link to="/dashboard/post-tuition" className="btn btn-success">
            Post New Tuition
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : tuitions.length === 0 ? (
          <p className="text-gray-600 text-center py-10">
            You haven't posted any tuitions yet.{' '}
            <Link
              to="/dashboard/post-tuition"
              className="link text-emerald-600"
            >
              Post one now!
            </Link>
          </p>
        ) : (
          <div className="grid gap-6">
            {tuitions.map((t) => (
              <div key={t._id} className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="card-title text-emerald-700">
                        {t.subject} - Class {t.class}
                      </h3>
                      <p>
                        Location: {t.location} | Salary: ৳{t.salary}/month
                      </p>
                      <p className="mt-2">
                        Details: {t.details || 'No details'}
                      </p>
                      <p className="mt-2">
                        Status:{' '}
                        <span
                          className={`badge ${
                            t.status === 'approved'
                              ? 'badge-success'
                              : 'badge-warning'
                          }`}
                        >
                          {t.status}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(t)}
                        className="btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowConfirm(t._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    <Link
                      to={`/tuitions/${t._id}`}
                      className="bg-red-400 btn btn-sm btn-primary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-xl font-bold mb-4">Delete Tuition?</h3>
              <p className="mb-6">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(showConfirm)}
                  className="btn btn-error flex-1"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
