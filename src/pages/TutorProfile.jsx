import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import api from '../api/axios'; // replaced axios with api
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTutor = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_API_URL}/users/${id}`
        );

        // Optional safety check
        if (res.data.role !== 'tutor') {
          toast.error('This user is not a tutor');
          navigate('/tutors');
          return;
        }

        setTutor(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load tutor profile');
      } finally {
        setLoading(false);
      }
    };

    loadTutor();
  }, [id, navigate]);

  const handleHireTutor = () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      toast.error('Please login as a student first');
      navigate('/login');
      return;
    }

    if (role !== 'student') {
      toast.error('Only students can hire tutors');
      return;
    }

    toast('Post a tuition so this tutor can apply', { icon: 'ℹ️' });
    navigate('/dashboard/post-tuition');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </DashboardLayout>
    );
  }

  if (!tutor) {
    return (
      <DashboardLayout>
        <p className="text-center text-red-600 py-20">
          Tutor not found
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          
          <img
            src={tutor.photoUrl || '/src/assets/default-avatar.jpg'}
            alt={tutor.name}
            className="w-40 h-40 rounded-full ring ring-emerald-600 ring-offset-4"
          />

          <div className="flex-1 space-y-3">
            <h2 className="text-3xl font-bold text-emerald-800">
              {tutor.name}
            </h2>

            <p  className="items-center"><strong>Email:</strong> {tutor.email}</p>
            <p className="items-center"><strong>Qualifications:</strong> {tutor.qualifications || 'Not provided'}</p>
            <p className="items-center"><strong>Experience:</strong> {tutor.experience || 0} years</p>

            <div className="mt-6">
              <button
                onClick={handleHireTutor}
                className="items-center bg-rose-500 shadow-lg shadow-rose-500/50 ... btn btn-success btn-lg w-32"
              >
                Hire This Tutor
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
