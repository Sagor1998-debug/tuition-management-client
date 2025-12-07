import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="navbar bg-primary text-primary-content sticky top-0 z-50 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl font-bold">TuitionHub</Link>
      </div>
      <div className="flex-none gap-4">
        <Link to="/tuitions" className="btn btn-ghost">Find Tuition</Link>
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoUrl || "https://i.imgur.com/0yQ9McP.png"} alt="profile" />
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-base-100 rounded-box w-52 text-black">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><a onClick={() => { logout(); navigate('/'); }}>Logout</a></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}