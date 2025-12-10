import DashboardLayout from '../../layouts/DashboardLayout';

export default function Revenue() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Revenue History</h2>
        <p className="text-gray-600">Your earnings and transactions will appear here after approvals and payments.</p>
      </div>
    </DashboardLayout>
  );
}