import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateRoadmap, getLatestRoadmap, updateProgress, getProgressSummary } from '../api/api';
import RecommendationCard from '../components/RecommendationCard';
import ProgressChart from '../components/ProgressChart';

function DashboardPage() {
  const [roadmap, setRoadmap] = useState(null);
  const [progressSummary, setProgressSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchDashboardData = async () => {
    try {
      const roadmapResponse = await getLatestRoadmap();
      setRoadmap(roadmapResponse.data);

      const progressResponse = await getProgressSummary();
      setProgressSummary(progressResponse.data);
    } catch (error) {
      setRoadmap(null);
      setProgressSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGenerate = async () => {
    setMessage('');
    setLoading(true);
    try {
      const response = await generateRoadmap();
      setRoadmap(response.data);
      const progressResponse = await getProgressSummary();
      setProgressSummary(progressResponse.data);
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

  const handleToggle = async (topicId, completed) => {
    try {
      await updateProgress(topicId, completed);
      const progressResponse = await getProgressSummary();
      setProgressSummary(progressResponse.data);
    } catch (error) {
      setMessage('Failed to update progress.');
    }
  };

  const isTopicCompleted = (topicId) => {
    if (!progressSummary) return false;
    const topicEntry = progressSummary.topics.find((t) => t.topic_id === topicId);
    return topicEntry ? topicEntry.completed : false;
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
              <button onClick={handleGenerate} className="bg-blue-600 text-white px-4 py-2 rounded">
                Generate My Roadmap
              </button>
            </div>
          </div>
        )}

        {roadmap && (
          <>
            {progressSummary && (
              <div className="bg-white p-6 rounded shadow mb-4 text-center">
                <h2 className="font-semibold mb-2">
                  Progress: {progressSummary.completed_topics} / {progressSummary.total_topics} ({progressSummary.percentage}%)
                </h2>
                <ProgressChart completed={progressSummary.completed_topics} total={progressSummary.total_topics} />
              </div>
            )}

            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4 text-gray-700">
                Skill level: <span className="font-semibold">{roadmap.skill_level}</span>
              </p>

              {roadmap.recommendations.map((rec) => (
                <RecommendationCard
                  key={rec.topic_id}
                  recommendation={rec}
                  isCompleted={isTopicCompleted(rec.topic_id)}
                  onToggle={handleToggle}
                />
              ))}

              <button onClick={handleGenerate} className="mt-3 text-sm text-blue-600 underline">
                Regenerate roadmap
              </button>
            </div>
          </>
        )}

        {message && <p className="mt-3 text-sm text-red-600">{message}</p>}
      </div>
    </div>
  );
}

export default DashboardPage;