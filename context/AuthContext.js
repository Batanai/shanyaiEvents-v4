import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const BASE_URL = "https://shanyai.events";

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/wp-json/meup/v1/login`, {
        user: username,
        pass: password,
      });

      const data = response.data;

      if (data.status === 'SUCCESS') {
        setUser(data.token);  // Store the token or user data

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          visibilityTime: 4000,
          position: 'top',
        });

        router.replace('/events');  // Navigate to the events screen
      } else {
        setError(data.msg);  // Set error message from API response

        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: data.msg || 'Please try again.',
          visibilityTime: 4000,
          position: 'top',
        });
      }
    } catch (err) {
      setError("Login failed. Please try again.");  // Fallback error message
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Please try again.',
        visibilityTime: 4000,
        position: 'top',
      });
    }
  };

  const logout = () => {
    setUser(null);
    router.replace('/login');  // Navigate back to the login screen
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};