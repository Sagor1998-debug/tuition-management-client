import DashboardLayout from '../layouts/DashboardLayout';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <DashboardLayout>
      <div className="bg-lime-300 rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-emerald-800 mb-6">
          {user?.role === 'admin' ? 'Admin Dashboard' : 
           user?.role === 'tutor' ? 'Tutor Dashboard' : 'Student Dashboard'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-100 p-6 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-emerald-800">Welcome Back!</h3>
            <p className="text-gray-700 mt-2">{user?.name}</p>
          </div>

          {user?.role === 'admin' && (
            <>
              <div className="bg-blue-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-blue-800">12</h3>
                <p className="text-gray-700">Pending Approvals</p>
              </div>
              <div className="bg-green-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-green-800">৳45,000</h3>
                <p className="text-gray-700">Total Revenue</p>
              </div>
            </>
          )}

          {user?.role === 'tutor' && (
            <>
              <div className="bg-purple-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-purple-800">8</h3>
                <p className="text-gray-700">Applications</p>
              </div>
              <div className="bg-yellow-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-yellow-800">৳12,000</h3>
                <p className="text-gray-700">Earnings</p>
              </div>
            </>
          )}

          {user?.role === 'student' && (
            <>
              <div className="bg-indigo-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-indigo-800">3</h3>
                <p className="text-gray-700">Active Tuitions</p>
              </div>
              <div className="bg-pink-100 p-6 rounded-xl text-center">
                <h3 className="text-5xl font-bold text-pink-800">5</h3>
                <p className="text-gray-700">Applications Sent</p>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}