import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

/** Attach JWT to every request if available. */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Handle 401 globally — clear session and redirect to login. */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mb_token');
      localStorage.removeItem('mb_user');
      // Navigate to login — hard redirect avoids stale React state
      const isConfigPath = window.location.pathname.startsWith('/admin');
      window.location.href = isConfigPath ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
