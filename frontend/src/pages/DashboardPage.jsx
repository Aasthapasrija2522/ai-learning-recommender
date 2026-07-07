import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 text-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600 mt-2">Your personalized learning roadmap will appear here.</p>
      <Link to="/quiz" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Take Skill Assessment Quiz
      </Link>
    </div>
  );
}

export default DashboardPage;