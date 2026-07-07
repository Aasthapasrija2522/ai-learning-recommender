import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import OnboardingPage from './pages/OnboardingPage';
import ProtectedRoute from './components/ProtectedRoute';
import QuizPage from './pages/QuizPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
          <OnboardingPage />
          </ProtectedRoute>
       }
    />
        <Route
        path="/quiz"
        element={
          <ProtectedRoute>
          <QuizPage />
          </ProtectedRoute>
       }
    />


      </Routes>
    </BrowserRouter>
  );
}

export default App;