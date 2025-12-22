import DashboardLayout from '../../layouts/DashboardLayout';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';

export default function PostTuition() {
  const navigate = useNavigate();
  const location = useLocation();
  const editTuition = location.state;

  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    location: '',
    salary: '',
    details: ''
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (editTuition) {
      setFormData({
        subject: editTuition.subject || '',
        class: editTuition.class || '',
        location: editTuition.location || '',
        salary: editTuition.salary || '',
        details: editTuition.details || ''
      });
      setIsEditMode(true);
    }
  }, [editTuition]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login first');
      return;
    }

    const config = {
      headers: { 'x-auth-token': token }
    };

    try {
      if (isEditMode) {
        await api.put(`/tuitions/${editTuition._id}`, formData, config);
        toast.success('Tuition updated successfully!');
      } else {
        await api.post('/tuitions', formData, config);
        toast.success('Tuition posted successfully!');
      }
      navigate('/dashboard/my-tuitions');
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.msg || `Failed to ${isEditMode ? 'update' : 'post'} tuition`
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">
          {isEditMode ? 'Edit Tuition Post' : 'Post New Tuition'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label font-medium">Subject</label>
            <input
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-medium">Class / Level</label>
            <input
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-medium">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-medium">Salary (BDT / month)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label font-medium">Additional Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              rows="5"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-success flex-1 text-lg">
              {isEditMode ? 'Update Tuition' : 'Post Tuition'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard/my-tuitions')}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
