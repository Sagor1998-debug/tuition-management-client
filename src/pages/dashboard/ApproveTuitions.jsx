import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ApproveTuitions() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please login as admin');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Correct route from your tuitions.js
        const res = await axios.get('http://localhost:5000/api/tuitions/manage', config);

        const pending = res.data.filter(post => post.status === 'pending');
        setPendingPosts(pending);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.response || err);
        setMessage('Failed to load pending posts. Make sure you are logged in as admin.');
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/tuitions/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPendingPosts(prev => prev.filter(post => post._id !== id));
      setMessage(`Post ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully!`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        <p className="mt-4 text-xl">Loading pending tuitions...</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-6">
      <h2 className="text-5xl font-bold text-center mb-10 text-emerald-800">
        Approve Tuition Posts ({pendingPosts.length} Pending)
      </h2>

      {message && (
        <div className="alert alert-info shadow-lg max-w-md mx-auto mb-8">
          <span>{message}</span>
        </div>
      )}

      {pendingPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-600">No pending tuition posts to review</p>
        </div>
      ) : (
        <div className="grid gap-8 max-w-5xl mx-auto">
          {pendingPosts.map(post => (
            <div key={post._id} className="card bg-base-100 shadow-2xl hover:shadow-3xl transition">
              <div className="card-body">
                <h3 className="text-3xl font-bold text-emerald-700">
                  {post.subject} - {post.class}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <p><strong>Location:</strong> {post.location}</p>
                  <p><strong>Salary:</strong> ৳{post.salary}/month</p>
                  <p><strong>Posted by:</strong> {post.postedBy?.name || 'Unknown'}</p>
                  <p><strong>Posted on:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-lg mt-6"><strong>Details:</strong></p>
                <p className="text-gray-700">{post.details}</p>

                <div className="card-actions justify-end mt-8 space-x-4">
                  <button onClick={() => handleStatus(post._id, 'approved')} className="bg-green-600 btn btn-success btn-sm">
                    Approve
                  </button>
                  <button onClick={() => handleStatus(post._id, 'rejected')} className="bg-red-600  btn btn-error btn-sm">
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}