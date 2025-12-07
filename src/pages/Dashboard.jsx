import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import TutorDashboard from './TutorDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome, {user.name} ({user.role.toUpperCase()})
      </h1>

      {user.role === 'student' && <StudentDashboard />}
      {user.role === 'tutor' && <TutorDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
}