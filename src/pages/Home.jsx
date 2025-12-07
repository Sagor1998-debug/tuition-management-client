import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary text-white">
      <div className="hero-content text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-6xl font-bold mb-6">Find Your Perfect Tutor</h1>
          <p className="text-xl mb-10">Connect with qualified tutors in Bangladesh instantly</p>
          <div className="space-x-6">
            <Link to="/tuitions" className="btn btn-accent btn-lg text-xl">
              Browse Tuitions
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg text-xl">
              Become a Tutor
            </Link>
          </div>

          <div className="stats shadow mt-16 grid grid-cols-3 gap-8">
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}