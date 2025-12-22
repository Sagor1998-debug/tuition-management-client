import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // replaced axios with api
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student', // default
    phone: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', formData); // use api instead of axios
      localStorage.setItem('token', res.data.token);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className=" bg-emerald-200  rounded-xl card-body">
          <h2 className="text-3xl font-bold text-center text-emerald-800">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">I want to register as</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="student">Student (Need a tutor)</option>
                <option value="tutor">Tutor (Want to teach)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-success w-full">
              Register
            </button>
          </form>

          <div className="text-center mt-6">
            <p>Already have an account? <a href="/login" className="link text-emerald-600">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
