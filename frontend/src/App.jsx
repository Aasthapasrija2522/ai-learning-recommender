import Welcome from './components/Welcome';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import './App.css';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 py-10">
      <Welcome name="Learner" />
      <SignupForm />
      <LoginForm />
    </div>
  );
}

export default App;
