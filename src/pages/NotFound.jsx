import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-8xl font-bold text-error">404</h1>
          <p className="text-2xl mt-6">Page Not Found</p>
          <Link to="/" className="text-white bg-pink-950 hover:bg-blue-600 hover:text-white ... btn btn-primary mt-8">Go Home</Link>
        </div>
      </div>
    </div>
  );
}