export default function AdminDashboard() {
  return (
    <div className="text-center py-20">
      <h2 className="text-4xl font-bold mb-8 text-error">Admin Panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-red-200 shadow-xl">
          <div className="card-body">
            <h3>Total Users</h3>
            <p className="text-4xl text-yellow-800 font-bold">1,234</p>
          </div>
        </div>
        <div className="card bg-red-200 shadow-xl">
          <div className="card-body">
            <h3>Pending Tuitions</h3>
            <p className="text-4xl font-bold text-warning">12</p>
          </div>
        </div>
        <div className="card bg-red-200 shadow-xl">
          <div className="card-body">
            <h3>Total Revenue</h3>
            <p className="text-4xl font-bold text-success">৳3,45,000</p>
          </div>
        </div>
        <div className="card bg-red-200 shadow-xl">
          <div className="card-body">
            <h3>Active Tutors</h3>
            <p className="text-4xl text-pink-500 font-bold">89</p>
          </div>
        </div>
      </div>
      <div className="mt-10 space-x-4">
        <button className="text-white bg-gradient-to-r from-lime-600 via-lime-800 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Manage Users</button>
        <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">Approve Tuitions</button>
      </div>
    </div>
  );
}