import DashboardLayout from '../../layouts/DashboardLayout';

export default function Calendar() {
  const classes = [
    { day: 'Monday', time: '5:00 PM', subject: 'Mathematics - Class 10' },
    { day: 'Wednesday', time: '6:00 PM', subject: 'Physics - Class 9' },
    { day: 'Friday', time: '7:00 PM', subject: 'English - SSC Level' },
    { day: 'Saturday', time: '4:00 PM', subject: 'Chemistry - HSC' },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-2xl shadow-xl p-4 p-10 max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12 text-emerald-800">
          My Class Schedule
        </h2>

        {/* Class Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {classes.map((cls, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">
                {cls.day}
              </h3>
              <div className="text-5xl font-extrabold text-emerald-800 mb-4">
                {cls.time}
              </div>
              <p className="text-lg font-medium text-gray-700">
                {cls.subject}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Future Feature Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 px-8 py-5 rounded-full shadow-md">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-semibold text-gray-800">
              Calendar sync with Google Calendar coming soon!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}