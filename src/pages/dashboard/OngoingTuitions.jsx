import DashboardLayout from '../../layouts/DashboardLayout';

export default function OngoingTuitions() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Ongoing Tuitions</h2>
        <p className="text-gray-600">Your approved tuitions will appear here.</p>
      </div>
    </DashboardLayout>
  );
}