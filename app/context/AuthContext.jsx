import React, { createContext, useState, useContext, useEffect } from 'react';
import storage from '../utils/storage';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load User and Token on App Start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await storage.getItem('authToken');
        const storedUser = await storage.getItem('userData');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const extractErrorMessage = (error) => {
    const detail = error.response?.data?.detail;
    
    // Mapping for common technical error codes from FastAPI-Users
    const errorMap = {
      "LOGIN_BAD_CREDENTIALS": "Invalid email or password. Please try again.",
      "LOGIN_USER_NOT_VERIFIED": "Your email is not verified. Please check your inbox.",
      "REGISTER_USER_ALREADY_EXISTS": "An account with this email already exists.",
    };

    if (Array.isArray(detail)) {
      return detail[0]?.msg || "An error occurred";
    } else if (typeof detail === "string") {
      return errorMap[detail] || detail;
    } else if (detail?.message) {
      return detail.message;
    }
    return error.message || "An error occurred";
  };

  const login = async (email, password) => {
    try {
      // Standard OAuth2 Password Flow requires form data, not JSON
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await apiClient.post('/api/v1/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      setToken(access_token);
      await storage.setItem('authToken', access_token);

      const userResponse = await apiClient.get('/api/v1/users/me');
      setUser(userResponse.data);
      await storage.setItem('userData', JSON.stringify(userResponse.data));

      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await storage.deleteItem('authToken');
      await storage.deleteItem('userData');
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData) => {
    try {
      const payload = {
        ...userData,
        registration_type: "email", // Hardcoded fallback to ensure Pydantic validator passes
      };
      
      console.log("Registering with payload:", JSON.stringify(payload, null, 2));
      await apiClient.post("/api/v1/auth/register", payload);
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  };

  const updateProfile = async (formData) => {
    try {
      // Filter out empty password
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }

      // Handle empty phone number as null (frontend parity)
      if (!payload.phone_number || payload.phone_number.trim() === '') {
        payload.phone_number = null;
      }

      const response = await apiClient.patch('/api/v1/users/me', payload);
      
      // Update local state and persistence
      const updatedUser = response.data;
      setUser(updatedUser);
      await storage.setItem('userData', JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, message: extractErrorMessage(error) };
    }
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const response = await apiClient.get('/api/v1/users/me');
      setUser(response.data);
      await storage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await apiClient.post("/api/v1/auth/forgot-password", { email });
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  };

  const requestVerificationToken = async (email) => {
    try {
      await apiClient.post("/api/v1/auth/request-verify-token", { email });
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error) };
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, register, updateProfile, refreshUser, forgotPassword, requestVerificationToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
