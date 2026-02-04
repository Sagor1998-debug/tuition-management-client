import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Tuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Filters (UI only)
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [sort, setSort] = useState('');

  // Fetch all tuitions
  const fetchTuitions = async () => {
    setLoading(true);
    try {
      // ✅ Correct backend path
      const res = await api.get('/tuitions');

      if (!Array.isArray(res.data)) {
        throw new Error('Invalid API response');
      }

      setTuitions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load tuitions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTuitions();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(tuitions.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTuitions = tuitions.slice(startIndex, endIndex);

  return (
    <div className="bg-cyan-400 shadow-lg shadow-cyan-500/50 py-10">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-10 text-emerald-800">
          All Tuitions
        </h1>

        {/* Filters UI */}
        <div className="bg-stone-100 rounded-xl shadow-lg p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search by subject/title"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => { setSubject(e.target.value); setPage(1); }}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setPage(1); }}
              className="input input-bordered w-full"
            />
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="select select-bordered w-full"
            >
              <option value="">Sort By</option>
              <option value="salary_asc">Salary: Low to High</option>
              <option value="salary_desc">Salary: High to Low</option>
              <option value="date_desc">Newest First</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              type="number"
              placeholder="Min Salary"
              value={minSalary}
              onChange={(e) => { setMinSalary(e.target.value); setPage(1); }}
              className="input input-bordered w-full"
            />
            <input
              type="number"
              placeholder="Max Salary"
              value={maxSalary}
              onChange={(e) => { setMaxSalary(e.target.value); setPage(1); }}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Tuitions */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : paginatedTuitions.length === 0 ? (
          <p className="text-center text-gray-600 py-20">
            No tuitions found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paginatedTuitions.map((t) => (
              <div
                key={t._id}
                className="card bg-gradient-to-r from-indigo-400 to-purple-400
                           shadow-xl shadow-indigo-500/40 rounded-xl"
              >
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-white">
                    {t.subject} — Class {t.class}
                  </h3>

                  <p className="text-white/90">
                    Location: {t.location}
                  </p>

                  <p className="text-white font-bold text-lg">
                    ৳{t.salary}/month
                  </p>

                  <div className="card-actions justify-center mt-2">
                    <Link
                      to={`/tuitions/${t._id}`}
                      className="bg-red-700 btn btn-sm btn-outline
                                 text-white font-bold border-white
                                 hover:bg-white hover:text-indigo-600"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-outline"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
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
