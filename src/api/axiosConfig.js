import axios from 'axios';

// This creates a central place for our API configuration
const apiClient = axios.create({
  // TEMPORARY FIX: Hardcoding the production URL to bypass Vercel build issue
  baseURL: '/api',
});

// This "interceptor" automatically adds the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;