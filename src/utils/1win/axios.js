import axios from 'axios';
import { API_URL } from '../../config/1win/config';

// Ensure API_URL is set correctly
const BASE_URL = API_URL || 'http://localhost:5008/api/1win';

// Debug: Log the API URL to ensure it's correct
if (typeof window !== 'undefined') {
  console.log('1Win API Base URL:', BASE_URL);
}

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Don't send cookies
  timeout: 30000, // 30 second timeout
});

// Verify the instance was created correctly
if (typeof window !== 'undefined') {
  console.log('✅ Axios instance created with baseURL:', api.defaults.baseURL);
}

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // CRITICAL FIX: Manually construct the full URL to ensure baseURL is always used
    // This fixes the issue where axios might not be applying baseURL correctly
    const originalUrl = config.url;
    
    console.log('🚀 Interceptor running!', {
      originalUrl: originalUrl,
      baseURL: config.baseURL,
      BASE_URL: BASE_URL,
      method: config.method
    });
    
    if (originalUrl && !originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      // Remove leading /api if present (since baseURL already includes /api/1win)
      let cleanUrl = originalUrl;
      if (cleanUrl.startsWith('/api/')) {
        cleanUrl = cleanUrl.replace(/^\/api/, '');
        console.warn('⚠️ Removed /api prefix from URL:', originalUrl, '->', cleanUrl);
      }
      // Ensure URL starts with /
      if (!cleanUrl.startsWith('/')) {
        cleanUrl = '/' + cleanUrl;
      }
      
      // Manually set the full URL as absolute URL
      const fullUrl = BASE_URL + cleanUrl;
      config.url = fullUrl;
      // Clear baseURL since we're using absolute URL now
      config.baseURL = '';
      
      console.log('✅ Fixed URL:', {
        original: originalUrl,
        cleaned: cleanUrl,
        method: config.method?.toUpperCase(),
        finalURL: fullUrl
      });
    } else {
      console.log('⚠️ URL is already absolute or empty:', {
        url: originalUrl,
        method: config.method?.toUpperCase(),
        baseURL: config.baseURL
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle CORS errors
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      console.error('Network error - check CORS configuration:', error);
    }
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      // Don't redirect here, let components handle it
    }
    
    return Promise.reject(error);
  }
);

export default api;





