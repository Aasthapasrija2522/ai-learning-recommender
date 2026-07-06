import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
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

export default api;