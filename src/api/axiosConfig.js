import axios from 'axios';

// This creates a central place for our API configuration
const apiClient = axios.create({
  // TEMPORARY FIX: Hardcoding the production URL to bypass Vercel build issue
  baseURL: 'https://civiclens-api-production-xxxx.up.railway.app/api',
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