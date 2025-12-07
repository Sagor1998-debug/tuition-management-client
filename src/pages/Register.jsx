import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    phone: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl text-center">Join TuitionHub</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
            <select
              className="select select-bordered w-full"
              value={form.role}
              onChange={(e) => setForm({...form, role: e.target.value})}
            >
              <option value="student">I'm a Student</option>
              <option value="tutor">I'm a Tutor</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              className="input input-bordered w-full"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              required
            />
            <button type="submit" className="btn btn-primary w-full">Register</button>
          </form>
          <p className="text-center mt-4">
            Already have an account? <Link to="/login" className="link link-primary">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}