import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (email, password, fullName) => {
  return api.post('/signup', {
    email: email,
    password: password,
    full_name: fullName,
  });
};

export const login = (email, password) => {
  return api.post('/login', {
    email: email,
    password: password,
  });
};

export const createProfile = (interests, careerGoal, currentSkills, dailyStudyMinutes) => {
  return api.post('/profile', {
    interests: interests,
    career_goal: careerGoal,
    current_skills: currentSkills,
    daily_study_minutes: dailyStudyMinutes,
  });
};

export const getProfile = () => {
  return api.get('/profile');
};
export const getQuizQuestions = () => {
  return api.get('/quiz/questions');
};

export const submitQuiz = (answers) => {
  return api.post('/quiz/submit', { answers: answers });
};

export default api;