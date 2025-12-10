import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-emerald-800">404</h1>
        <h2 className="text-4xl font-bold mt-6 text-gray-800">Page Not Found</h2>
        <p className="text-xl text-gray-600 mt-4 mb-10">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link to="/" className="btn btn-success btn-lg">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}