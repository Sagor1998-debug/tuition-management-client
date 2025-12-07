import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Tuitions() {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTuitions = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tuitions`, {
        params: { page, search }
      });
      setTuitions(res.data.tuitions);
      setTotalPages(res.data.pagination.pages);
      setLoading(false);
    };
    fetchTuitions();
  }, [page, search]);

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">All Available Tuitions</h1>

      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by subject, location..."
          className="input input-bordered input-lg w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tuitions.map(t => (
          <Link to={`/tuitions/${t._id}`} key={t._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition">
            <div className="card-body">
              <h2 className="card-title">{t.subject} - {t.class}</h2>
              <p className="text-gray-600">{t.location}</p>
              <div className="badge badge-secondary badge-lg">৳{t.salary}/month</div>
              <p className="mt-2">{t.description?.slice(0, 100)}...</p>
              <div className="card-actions justify-end mt-4">
                <div className="badge badge-outline">{t.schedule}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10 gap-2">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn">Previous</button>
        <span className="btn btn-ghost">Page {page} of {totalPages}</span>
        <button onClick={() => setPage(p => p+1)} disabled={page === totalPages} className="btn">Next</button>
      </div>
    </div>
  );
}