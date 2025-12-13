export default function About() {
  return (
    <div className="min-h-screen rounded-xl bg-rose-50 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-8 text-emerald-800">About TuitionHub</h1>
        <div className="bg-emerald-600 rounded-xl max-w-4xl mx-auto text-white text-center space-y-6 text-lg ">
           <p>Our platform ensures safe payments, verified tutors, and seamless communication.</p>
          <p>TuitionHub connects students with qualified tutors across the country.</p>
          <p>We believe quality education should be accessible to everyone.</p>
          <p className="text-white font-bold text-xl">Empowering education, one tuition at a time.</p>
        </div>
      </div>
    </div>
  );
}