import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup, login } from '../api/api';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await signup(email, password, fullName);

      const response = await login(email, password);

      localStorage.setItem('token', response.data.access_token);

      navigate('/onboarding');
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.detail}`);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-3"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>

      {message && (
        <p className="mt-3 text-sm text-gray-700">
          {message}
        </p>
      )}
    </form>
  );
}

export default SignupForm;