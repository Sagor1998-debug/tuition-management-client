import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TutorProfile() {
  const { id } = useParams();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`http://localhost:5000/dev/tutors/${id}`);
        setTutor(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 404) setError('Tutor not found');
        else setError('Failed to load tutor profile.');
        setLoading(false);
      }
    };

    if (id) fetchTutor();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-emerald-600"></span>
    </div>
  );

  if (error || !tutor) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-red-600 text-3xl mb-6">{error}</p>
      <Link to="/tutors" className="btn btn-primary">← Back to Tutors</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/tutors" className="btn btn-ghost mb-8">← Back to Tutors</Link>
        <div className="bg-rose-400 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-48"></div>

          <div className="relative px-10 pb-12 -mt-24 flex flex-col md:flex-row items-center md:items-end gap-10">
            <img
              src={tutor.photoUrl || "https://randomuser.me/api/portraits/lego/5.jpg"}
              alt={tutor.name}
              className="w-56 h-56 rounded-full border-8 border-white shadow-2xl object-cover"
            />

            <div className="text-center md:text-left flex-1">
              <h1 className="text-5xl font-bold text-gray-800">{tutor.name}</h1>
              <p className="text-3xl text-emerald-700 mt-3">{tutor.qualifications}</p>
              <p className="text-2xl text-gray-600 mt-2">{tutor.experience} Experinced</p>
            </div>

            <div className="text-center bg-emerald-200 rounded-2xl p-6">
              <p className="text-xl font-semibold text-gray-800">Contact</p>
              <p className="text-lg text-gray-700 mt-2">{tutor.phone}</p>
              <p className="text-lg text-gray-600 mt-1">{tutor.email}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="bg-red-800 text-white btn btn-success btn-lg text-xl px-16">
              Hire This Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
