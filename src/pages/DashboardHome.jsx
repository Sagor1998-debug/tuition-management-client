// src/pages/DashboardHome.jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Correct paths: go into the 'dashboard' subfolder
import StudentDashboard from './dashboard/StudentDashboard.jsx';
import TutorDashboard from './dashboard/TutorDashboard.jsx';
import AdminDashboard from './dashboard/AdminDashboard.jsx';

export default function DashboardHome() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'tutor') {
    return <TutorDashboard />;
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default (student or any other role)
  return <StudentDashboard />;
}