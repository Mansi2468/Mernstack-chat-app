import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5001/api' : '/api',
  withCredentials: true,
});

// Response interceptor to silently handle 401 for auth check
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config.url === '/auth/check') {
      // Silently handle unauthorized auth check
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
