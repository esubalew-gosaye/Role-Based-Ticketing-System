import axios from 'axios';

const API_URL = 'http://localhost:4000/api';


const axiosInstance = axios.create({
  baseURL: API_URL,
});


const publicEndpoints = ['/auth/login', '/auth/signup', '/auth/forgot-password'];


axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized: Redirecting to login...');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;