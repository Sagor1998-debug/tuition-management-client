import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TuitionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [formData, setFormData] = useState({
    qualifications: '',
    experience: '',
    expectedSalary: '',
    message: ''
  });

  // Fetch tuition details
  useEffect(() => {
    axios.get(`http://localhost:5000/dev/tuitions/${id}`)
      .then(res => {
        setTuition(res.data);
        if (user?.bookmarks?.includes(id)) setIsBookmarked(true);
      })
      .catch(() => toast.error('Failed to load tuition'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login as tutor');

    try {
      await axios.post('http://localhost:5000/api/applications', {
        tuitionId: id,
        expectedSalary: formData.expectedSalary,
        message: formData.message,
        qualifications: formData.qualifications,
        experience: formData.experience
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Applied successfully!');
      setShowModal(false);
      setFormData({ qualifications: '', experience: '', expectedSalary: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to apply');
    }
  };

  const handleBookmark = async () => {
    if (!user) return toast.error('Please login to bookmark');

    try {
      await axios.post(`http://localhost:5000/api/users/bookmark/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks!');
    } catch {
      toast.error('Failed to bookmark');
    }
  };

  // Loading state
  if (loading) return (
    <div className="text-center p-10">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  // Tuition not found
  if (!tuition) return (
    <div className="text-center p-10 text-red-600">
      Tuition not found.
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl mx-auto">
        <div className="card-body">
          <div className="flex justify-between items-start mb-4">
            <h2 className="card-title text-4xl text-emerald-800">
              {tuition?.subject} - Class {tuition?.class}
            </h2>

            {user && (
              <button
                onClick={handleBookmark}
                className={`btn btn-lg ${isBookmarked ? 'btn-warning' : 'btn-outline'} hover:btn-warning`}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            )}
          </div>

          <p className="text-2xl text-emerald-600 mt-4 font-bold">৳{tuition?.salary}/month</p>
          <p className="text-lg">Location: {tuition?.location}</p>
          <p>Schedule: {tuition?.schedule || 'Not specified'}</p>
          <div className="divider"></div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{tuition?.description || tuition?.details || 'No description available.'}</p>
          </div>

          <div className="card-actions justify-end mt-8 gap-4">
            {user?.role === 'tutor' && (
              <>
                <button 
                  onClick={() => setShowModal(true)} 
                  className="btn btn-success btn-lg"
                >
                  Apply for this Tuition
                </button>

                {tuition?.applied && (
                  <div className="alert alert-info">
                    You have already applied for this tuition
                  </div>
                )}

                {tuition?.approvedTutor === user?.id && (
                  <button 
                    onClick={() => navigate(`/messages/${tuition?.postedBy}`)} 
                    className="btn btn-info"
                  >
                    Chat with Student
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-emerald-800">Apply for Tuition</h3>
              <form onSubmit={handleApply} className="space-y-6">
                <div>
                  <label className="label font-medium">Name</label>
                  <input value={user?.name || ''} className="input input-bordered w-full" disabled />
                </div>
                <div>
                  <label className="label font-medium">Email</label>
                  <input value={user?.email || ''} className="input input-bordered w-full" disabled />
                </div>
                <div>
                  <label className="label font-medium">Qualifications <span className="text-error">*</span></label>
                  <textarea name="qualifications" value={formData.qualifications} onChange={handleChange} className="textarea textarea-bordered w-full" rows="3" required />
                </div>
                <div>
                  <label className="label font-medium">Experience <span className="text-error">*</span></label>
                  <textarea name="experience" value={formData.experience} onChange={handleChange} className="textarea textarea-bordered w-full" rows="3" required />
                </div>
                <div>
                  <label className="label font-medium">Expected Salary (BDT/month) <span className="text-error">*</span></label>
                  <input type="number" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="input input-bordered w-full" required />
                </div>
                <div>
                  <label className="label font-medium">Message to Student (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="textarea textarea-bordered w-full" rows="4" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="btn btn-success flex-1 text-lg">Submit Application</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost flex-1">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
