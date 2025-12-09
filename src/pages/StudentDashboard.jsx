export default function StudentDashboard() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-8">Student Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">My Tuitions</h3>
            <p className="text-5xl font-bold text-primary">3</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">Applications</h3>
            <p className="text-5xl font-bold text-secondary">7</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">Total Spent</h3>
            <p className="text-5xl font-bold text-accent">৳24,000</p>
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-lg mt-10">Post New Tuition</button>
    </div>
  );
}