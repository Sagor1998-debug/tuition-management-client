import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function TuitionDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [tuition, setTuition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/tuitions/${id}`)
      .then(res => setTuition(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user || user.role !== 'tutor') return toast.error('Login as tutor');
    
    const { value: salary } = await Swal.fire({
      title: 'Expected Salary',
      input: 'number',
      showCancelButton: true
    });
    if (!salary) return;

    await axios.post(`${import.meta.env.VITE_API_URL}/applications`, {
      tuitionId: id,
      expectedSalary: salary,
      message: 'I am interested!'
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }});
    toast.success('Applied successfully!');
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-4xl mx-auto">
        <div className="card-body">
          <h2 className="card-title text-4xl">{tuition.subject} - {tuition.class}</h2>
          <p className="text-2xl text-primary mt-4">৳{tuition.salary}/month</p>
          <p className="text-lg">Location: {tuition.location}</p>
          <p>Schedule: {tuition.schedule}</p>
          <div className="divider"></div>
          <p>{tuition.description}</p>
          {user?.role === 'tutor' && (
            <button onClick={handleApply} className="btn btn-success btn-lg mt-6">Apply Now</button>
          )}
        </div>
      </div>
    </div>
  );
}