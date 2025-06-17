import axios from 'axios';

/**
 * API instance
 * @description API instance for the application
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor (for error handling)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('The error', error)
        const formattedError = error.response?.data || error;
      return Promise.reject(formattedError);
    }
  );