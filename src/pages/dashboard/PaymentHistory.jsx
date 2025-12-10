import DashboardLayout from '../../layouts/DashboardLayout';

export default function PaymentHistory() {
  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">Payment History</h2>
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>Your payment history will appear here after hiring tutors.</span>
        </div>
        {/* You can expand this later with real Stripe data */}
      </div>
    </DashboardLayout>
  );
}