import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Home() {
  const [tuitions, setTuitions] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch Latest Tuitions — your endpoint exists!
      try {
        const tuitionRes = await axios.get('http://localhost:5000/api/tuitions');
        // Backend returns { tuitions: [...], pagination: ... } or direct array
        const tuitionList = tuitionRes.data.tuitions || tuitionRes.data || [];
        setTuitions(tuitionList.slice(0, 6));
      } catch (err) {
        console.log('Tuitions not loaded yet (normal if no data)');
        setTuitions([]);
      }

      // Fetch Latest Tutors — now safe even if endpoint missing
      try {
        const tutorRes = await axios.get('http://localhost:5000/api/users/tutors');
        setTutors(tutorRes.data.slice(0, 6));
      } catch (err) {
        console.log('Tutors endpoint not ready — showing empty for now');
        setTutors([]);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* YOUR BEAUTIFUL HERO - Kept + Enhanced Animation */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
        <div className="hero-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.h1
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-6xl font-bold mb-6"
            >
              Find Your Perfect Tutor
            </motion.h1>
            <p className="text-xl mb-10">Connect with qualified tutors in Bangladesh instantly</p>
            <div className="space-x-6">
              <Link to="/tuitions" className="btn btn-accent btn-lg text-xl">
                Browse Tuitions
              </Link>
              <Link to="/register" className="btn btn-outline btn-lg text-xl">
                Become a Tutor
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="stats shadow mt-16 grid grid-cols-3 gap-8"
            >
              <div className="stat text-center">
                <div className="stat-value text-4xl">500+</div>
                <div className="stat-title text-white">Active Tuitions</div>
              </div>
              <div className="stat text-center">
                <div className="stat-value text-4xl">1,200+</div>
                <div className="stat-title text-white">Verified Tutors</div>
              </div>
              <div className="stat text-center">
                <div className="stat-value text-4xl">98%</div>
                <div className="stat-title text-white">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* DYNAMIC LATEST TUITION POSTS */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-emerald-800">Latest Tuition Posts</h2>
          {loading ? (
            <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>
          ) : tuitions.length === 0 ? (
            <p className="text-center text-gray-600">No tuitions posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tuitions.map((tuition, i) => (
                <motion.div
                  key={tuition._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card bg-base-100 shadow-xl hover:shadow-2xl transition"
                >
                  <div className="card-body">
                    <h3 className="card-title">{tuition.subject}</h3>
                    <p>Class: {tuition.class}</p>
                    <p>Location: {tuition.location}</p>
                    <p className="font-bold text-emerald-600">৳{tuition.salary}/month</p>
                    <div className="card-actions justify-end">
                      <Link to={`/tuitions/${tuition._id}`} className="btn btn-sm btn-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* DYNAMIC LATEST TUTORS */}
      <section className="py-20 bg-base-300">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-emerald-800">Top Verified Tutors</h2>
          {tutors.length === 0 ? (
            <p className="text-center text-gray-600">No tutors registered yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
              {tutors.map((tutor, i) => (
                <motion.div
                  key={tutor._id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="avatar">
                    <div className="w-24 rounded-full ring ring-primary ring-offset-2">
                      <img src={tutor.photoUrl || '/src/assets/default-avatar.jpg'} alt={tutor.name} />
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold">{tutor.name}</h3>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-emerald-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: "1", title: "Post Your Need", desc: "Create a tuition post with your requirements" },
              { step: "2", title: "Receive Applications", desc: "Tutors apply directly to your post" },
              { step: "3", title: "Hire & Start", desc: "Choose the best tutor and begin learning" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-violet-200 rounded-xl text-center"
              >
                <div className="bg-rose-600 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-emerald-800">Why Choose TuitionHub?</h2>
          <div className=" grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "✅", title: "Verified Tutors" },
              { icon: "🔒", title: "Secure Payment" },
              { icon: "⭐", title: "Rated System" },
              { icon: "💬", title: "Easy Communication" }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-violet-300 text-center bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="text-6xl mb-4">{feat.icon}</div>
                <h3 className="text-xl font-bold">{feat.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}