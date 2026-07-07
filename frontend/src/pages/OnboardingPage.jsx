import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProfile } from '../api/api';

function OnboardingPage() {
  const [interests, setInterests] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const interestsArray = interests.split(',').map((item) => item.trim()).filter((item) => item.length > 0);
    const skillsArray = currentSkills.split(',').map((item) => item.trim()).filter((item) => item.length > 0);

    try {
      await createProfile(interestsArray, careerGoal, skillsArray, parseInt(dailyStudyMinutes, 10));
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Tell us about yourself</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Interests (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. web development, AI, data science"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Career Goal
        </label>
        <select
          value={careerGoal}
          onChange={(e) => setCareerGoal(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        >
          <option value="">Select a career goal</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="ML Engineer">ML Engineer</option>
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Skills (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g. python, sql"
          value={currentSkills}
          onChange={(e) => setCurrentSkills(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Daily Study Time (minutes)
        </label>
        <input
          type="number"
          placeholder="e.g. 120"
          value={dailyStudyMinutes}
          onChange={(e) => setDailyStudyMinutes(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Save and Continue
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

export default OnboardingPage;