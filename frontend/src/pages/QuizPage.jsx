import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizQuestions, submitQuiz } from '../api/api';

function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getQuizQuestions();
        setQuestions(response.data.questions);
      } catch (error) {
        setMessage('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId, optionKey) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionKey,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await submitQuiz(answers);
      setMessage(`You scored ${response.data.score} out of ${response.data.total_questions}!`);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      setMessage('Something went wrong submitting the quiz.');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading quiz...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Skill Assessment Quiz</h2>

        {questions.map((q) => (
          <div key={q.id} className="mb-5">
            <p className="font-medium mb-2">{q.question}</p>
            {Object.entries(q.options).map(([key, value]) => (
              <label key={key} className="block text-sm text-gray-700 mb-1">
                <input
                  type="radio"
                  name={q.id}
                  value={key}
                  checked={answers[q.id] === key}
                  onChange={() => handleAnswerChange(q.id, key)}
                  className="mr-2"
                  required
                />
                {value}
              </label>
            ))}
          </div>
        ))}

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Submit Quiz
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
  );
}

export default QuizPage;