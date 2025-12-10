export default function TutorDashboard() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-8">Tutor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">Active Tuitions</h3>
            <p className="text-5xl font-bold text-success">5</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">Total Earnings</h3>
            <p className="text-5xl font-bold text-success">৳45,000</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="text-2xl">Rating</h3>
            <p className="text-5xl font-bold text-warning">4.8 ★</p>
          </div>
        </div>
      </div>
      <button className="btn btn-success btn-lg mt-10">Find New Students</button>
    </div>
  );
}