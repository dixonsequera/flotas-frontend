import { createContext, useState, useEffect } from 'react';
import api from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Add axios interceptor for debugging
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use(
      config => {
        console.log(`Making ${config.method.toUpperCase()} request to: ${config.url}`);
        return config;
      },
      error => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      response => {
        console.log(`Response from ${response.config.url}:`, response.status);
        return response;
      },
      error => {
        console.error('Response error:', error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptors
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log('Loading user with token');
          const res = await api.get('/api/users/me/profile');
          console.log('User loaded successfully:', res.data);
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError(err.response?.data?.message || 'Authentication error');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      console.log('Registering user with data:', formData);
      const apiUrl = '/api/auth/register';
      console.log('Sending request to:', apiUrl);
      
      const res = await api.post(apiUrl, formData);
      console.log('Registration successful:', res.data);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Registration error in context:', err);
      
      let errorMessage = 'Registration failed';
      
      if (err.response) {
        console.error('Server response:', err.response.data);
        errorMessage = err.response.data.message || 'Server error during registration';
      } else if (err.request) {
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('Error setting up request:', err.message);
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      console.log('Logging in with:', formData.email);
      const res = await api.post('/api/auth/login', formData);
      console.log('Login successful:', res.data);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Invalid credentials';
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put(`/api/users/${user.id}`, formData);
      setUser(res.data.user);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Profile update error:', err);
      
      let errorMessage = 'Profile update failed';
      
      if (err.response) {
        errorMessage = err.response.data.message || 'Error updating profile';
      } else if (err.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 