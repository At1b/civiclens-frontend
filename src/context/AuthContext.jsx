import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // We can store user details later

  useEffect(() => {
    // If a token exists, we can optionally fetch user details
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // You could add a call here to a `/api/users/me` endpoint to get user details
    }
  }, [token]);

  const login = async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete apiClient.defaults.headers.common['Authorization'];
  };

  const value = { token, user, login, logout, register };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This is a custom hook that makes it easy to use our context
export const useAuth = () => {
  return useContext(AuthContext);
};