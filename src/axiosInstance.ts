import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include credentials with every request
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response, // If response is successful, return it as usual
  (error) => {
    if (error.response && error.response.status === 401) {
        
      localStorage.removeItem('fetch-access-token'); 
      sessionStorage.clear(); 

      // Redirect to login page
      window.location.href = '/'; 
    }
    return Promise.reject(error); 
  }
);

export default axiosInstance;