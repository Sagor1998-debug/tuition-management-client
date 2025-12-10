export default function AdminDashboard() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-8 text-error">Admin Panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3>Total Users</h3>
            <p className="text-4xl font-bold">1,234</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3>Pending Tuitions</h3>
            <p className="text-4xl font-bold text-warning">12</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3>Total Revenue</h3>
            <p className="text-4xl font-bold text-success">৳3,45,000</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3>Active Tutors</h3>
            <p className="text-4xl font-bold">89</p>
          </div>
        </div>
      </div>
      <div className="mt-10 space-x-4">
        <button className="btn btn-error btn-lg">Manage Users</button>
        <button className="btn btn-warning btn-lg">Approve Tuitions</button>
      </div>
    </div>
  );
}