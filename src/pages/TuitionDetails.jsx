import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TuitionDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    qualifications: '',
    experience: '',
    expectedSalary: '',
    message: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/tuitions/${id}`)
      .then(res => setTuition(res.data))
      .catch(() => toast.error('Failed to load tuition'))
      .finally(() => setLoading(false));
  }, [id]);

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
      // Reset form
      setFormData({
        qualifications: '',
        experience: '',
        expectedSalary: '',
        message: ''
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to apply');
    }
  };

  if (loading) return <div className="text-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-4xl text-emerald-800">{tuition.subject} - Class {tuition.class}</h2>
          <p className="text-2xl text-emerald-600 mt-4 font-bold">৳{tuition.salary}/month</p>
          <p className="text-lg">Location: {tuition.location}</p>
          <p>Schedule: {tuition.schedule || 'Not specified'}</p>
          <div className="divider"></div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{tuition.description || tuition.details}</p>
          </div>

          {/* Apply Button for Tutors */}
          {user?.role === 'tutor' && (
            <button 
              onClick={() => setShowModal(true)} 
              className="btn btn-success btn-lg mt-8"
            >
              Apply for this Tuition
            </button>
          )}

          {/* Application Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-base-100 rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-6 text-emerald-800">Apply for Tuition</h3>
                  <form onSubmit={handleApply} className="space-y-6">
                    {/* Read-only fields */}
                    <div>
                      <label className="label font-medium">Name</label>
                      <input value={user?.name || ''} className="input input-bordered w-full" disabled />
                    </div>
                    <div>
                      <label className="label font-medium">Email</label>
                      <input value={user?.email || ''} className="input input-bordered w-full" disabled />
                    </div>

                    {/* Required fields */}
                    <div>
                      <label className="label font-medium">Qualifications <span className="text-error">*</span></label>
                      <textarea 
                        name="qualifications" 
                        value={formData.qualifications}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full" 
                        rows="3" 
                        placeholder="e.g., BSc in Mathematics, Teaching experience at school"
                        required
                      />
                    </div>
                    <div>
                      <label className="label font-medium">Experience <span className="text-error">*</span></label>
                      <textarea 
                        name="experience" 
                        value={formData.experience}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full" 
                        rows="3" 
                        placeholder="e.g., 5 years teaching Class 9-10 students"
                        required
                      />
                    </div>
                    <div>
                      <label className="label font-medium">Expected Salary (BDT/month) <span className="text-error">*</span></label>
                      <input 
                        type="number" 
                        name="expectedSalary" 
                        value={formData.expectedSalary}
                        onChange={handleChange}
                        className="input input-bordered w-full" 
                        placeholder="e.g., 8000"
                        required
                      />
                    </div>
                    <div>
                      <label className="label font-medium">Message to Student (Optional)</label>
                      <textarea 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full" 
                        rows="4"
                        placeholder="Why should the student hire you?"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="submit" className="btn btn-success flex-1 text-lg">
                        Submit Application
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setShowModal(false)} 
                        className="btn btn-ghost flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}