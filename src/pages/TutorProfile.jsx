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
    <Link to="/tutors" className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors btn btn-ghost mb-8">
      ← Back to Tutors
    </Link>

    <div className="bg-rose-400 rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Upper gradient section */}
      <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-64 relative">
        {/* Tutor name on the upper section */}
        {/* Upper gradient section */}
<div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-64 relative flex items-center justify-center">
  <h1 className="text-5xl md:text-7xl font-bold text-gray-800 drop-shadow-2xl">
    {tutor.name}
  </h1>
</div>
      </div>

      {/* Lower pink section with content */}
      <div className="relative px-8 pt-20 pb-12 -mt-16">
        <div className="flex flex-col md:flex-row items-start gap-10 max-w-5xl mx-auto">
          {/* Profile Image - positioned higher */}
          <div className="relative -mt-32 md:-mt-40">
            <img
              src={tutor.photoUrl || "https://randomuser.me/api/portraits/lego/5.jpg"}
              alt={tutor.name}
              className="w-48 h-48 md:w-56 md:h-56 rounded-full border-8 border-white shadow-2xl object-cover"
            />
          </div>

          {/* Qualifications & Experience */}
          <div className="bg-emerald-200 rounded-2xl p-6 shadow-lg flex-1 text-center md:text-left mt-4 md:mt-8">
            <p className="text-2xl text-emerald-700 font-medium">
              {tutor.qualifications}
            </p>
            <p className="text-xl text-gray-600 mt-3">
              {tutor.experience} Experienced
            </p>
          </div>

          {/* Contact Box */}
          <div className="bg-emerald-200 rounded-2xl p-6 shadow-lg text-center">
            <p className="text-xl font-semibold text-gray-800">Contact</p>
            <p className="text-lg text-gray-700 mt-2">{tutor.phone}</p>
            <p className="text-lg text-gray-600 mt-1">{tutor.email}</p>
          </div>
        </div>

        {/* Hire Button - moved up, centered */}
        <div className="text-center mt-10">
          <button className="bg-red-800 hover:bg-red-900 text-white btn btn-lg text-xl px-16 py-4 rounded-xl shadow-lg transition-all">
            Hire This Tutor
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
