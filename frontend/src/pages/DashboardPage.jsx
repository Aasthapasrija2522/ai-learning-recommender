import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateRoadmap, getLatestRoadmap } from '../api/api';
import RecommendationCard from '../components/RecommendationCard';

function DashboardPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await getLatestRoadmap();
        setRoadmap(response.data);
      } catch (error) {
        setRoadmap(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const handleGenerate = async () => {
    setMessage('');
    setLoading(true);
    try {
      const response = await generateRoadmap();
      setRoadmap(response.data);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage('Something went wrong generating your roadmap.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading your dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Your Learning Roadmap</h1>

        {!roadmap && (
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-600 mb-4">You don't have a roadmap yet.</p>
            <Link to="/quiz" className="text-blue-600 underline">Take the quiz first</Link>
            <div className="mt-4">
              <button
                onClick={handleGenerate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Generate My Roadmap
              </button>
            </div>
          </div>
        )}

        {roadmap && (
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4 text-gray-700">
              Skill level: <span className="font-semibold">{roadmap.skill_level}</span>
            </p>

            {roadmap.recommendations.map((rec) => (
              <RecommendationCard key={rec.topic_id} recommendation={rec} />
            ))}

            <button
              onClick={handleGenerate}
              className="mt-3 text-sm text-blue-600 underline"
            >
              Regenerate roadmap
            </button>
          </div>
        )}

        {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}

export default DashboardPage;