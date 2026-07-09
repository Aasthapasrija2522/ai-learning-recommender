import axios from 'axios';

const API_BASE_URL = 'https://ai-learning-recommender-2dgt.onrender.com/';

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
export const generateRoadmap = () => {
  return api.post('/roadmap/generate');
};

export const getLatestRoadmap = () => {
  return api.get('/roadmap/latest');
};
export const updateProgress = (topicId, completed) => {
  return api.post('/progress', { topic_id: topicId, completed: completed });
};

export const getProgressSummary = () => {
  return api.get('/progress/summary');
};

export default api;