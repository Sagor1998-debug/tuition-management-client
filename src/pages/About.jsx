export default function About() {
  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-8 text-emerald-800">About TuitionHub</h1>
        <div className="max-w-4xl mx-auto text-center space-y-6 text-lg text-gray-700">
          <p>TuitionHub connects students with qualified tutors across the country.</p>
          <p>We believe quality education should be accessible to everyone.</p>
          <p>Our platform ensures safe payments, verified tutors, and seamless communication.</p>
          <p className="text-emerald-600 font-bold text-xl">Empowering education, one tuition at a time.</p>
        </div>
      </div>
    </div>
  );
}