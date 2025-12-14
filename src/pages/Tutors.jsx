import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Tutors() {
  const [tutors, setTutors] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const tutorsPerPage = 10;

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:5000/dev/tutors');
        console.log('Fetched tutors:', res.data);

        // Safe handling: array directly or wrapped in "tutors"
        const tutorsArray = Array.isArray(res.data) ? res.data : res.data?.tutors || [];
        setTutors(tutorsArray);
      } catch (err) {
        console.error(err);
        setError('Failed to load tutors. Make sure backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, []);

  // Filter + sort (always operate on array)
  const filteredTutors = Array.isArray(tutors)
    ? tutors
        .filter(tutor => {
          if (!tutor) return false;
          const matchesSearch =
            tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tutor.qualifications?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesSubject =
            !subjectFilter ||
            tutor.qualifications?.toLowerCase().includes(subjectFilter.toLowerCase());
          return matchesSearch && matchesSubject;
        })
        .sort((a, b) => {
          if (sortBy === 'experience') {
            const expA = parseInt(a.experience) || 0;
            const expB = parseInt(b.experience) || 0;
            return expB - expA;
          }
          if (sortBy === 'name') return a.name.localeCompare(b.name);
          return 0;
        })
    : [];

  // Pagination logic
  const indexOfLastTutor = currentPage * tutorsPerPage;
  const indexOfFirstTutor = indexOfLastTutor - tutorsPerPage;
  const currentTutors = filteredTutors.slice(indexOfFirstTutor, indexOfLastTutor);
  const totalPages = Math.ceil(filteredTutors.length / tutorsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-10 text-emerald-800">
          Find Expert Tutors
        </h1>

        {/* Filters */}
        <div className="bg-base-100 rounded-xl shadow-md p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name or subject"
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by subject"
              className="input input-bordered w-full"
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
            />
            <select
              className="select select-bordered w-full"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Sort By</option>
              <option value="experience">Most Experienced</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>
        </div>

        {/* Tutor Cards */}
        {currentTutors.length === 0 ? (
          <p className="text-center text-xl text-gray-600">No tutors found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {currentTutors.map(tutor => (
              <div key={tutor._id} className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
                <div className="flex flex-col items-center text-center">
                  <img
                    src={tutor.photoUrl || 'https://randomuser.me/api/portraits/lego/5.jpg'}
                    alt={tutor.name}
                    className=" w-28 h-28 rounded-full mb-4 object-cover border-4 border-emerald-600"
                  />
                  <h3 className="text-xl font-bold text-rose-900">{tutor.name}</h3>
                  <p className="text-sm text-rose-900 mt-2">{tutor.qualifications || 'No qualifications listed'}</p>
                  <p className="text-sm text-rose-900 mt-1">{tutor.experience || 'Not specified'}</p>
                  <Link to={`/tutor/${tutor._id}`} className="bg-transparent hover:bg-purple-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-purple-600 hover:border-transparent rounded">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn btn-outline"
            >
              Previous
            </button>
            <span className="flex items-center px-3 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-outline"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
