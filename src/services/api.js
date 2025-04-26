// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://172.20.10.3:5000/api',
  baseURL: 'https://bestworkers-server.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
//https://bestworkers-server.onrender.com

// Existing auth and user API methods remain unchanged
export const registerUser = async userData => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error);
    throw {
      error: 'Registration failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const loginUser = async credentials => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw {
      error: 'Login failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const verifyOtp = async otpData => {
  try {
    console.log('Sending OTP verification request:', otpData);
    const response = await api.post('/auth/verify-otp', otpData);
    console.log('OTP verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('OTP verification API error:', error);
    throw {
      error: 'OTP verification failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const resendOtp = async email => {
  try {
    const response = await api.post('/auth/resend-otp', {email});
    return response.data;
  } catch (error) {
    console.error('Resend OTP API error:', error);
    throw {
      error: 'Resend OTP failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const getUserProfile = async () => {
  const userId = await AsyncStorage.getItem('userID');
  const response = await api.get(`/auth/me?userId=${userId}`);
  return response.data;
};

export const updateUserProfile = async userData => {
  try {
    const response = await api.put('/users/update', userData);
    return response.data;
  } catch (error) {
    console.error('Update Profile API error:', error);
    throw {
      error: 'Update profile failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const changeUserPin = async pinData => {
  try {
    const response = await api.put('/users/change-pin', pinData);
    return response.data;
  } catch (error) {
    console.error('Change PIN API error:', error);
    throw {
      error: 'Change PIN failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export const addProfession = async (professionData) => {
  try {
    const userId = await AsyncStorage.getItem('userID');
    if (!userId) throw new Error('User ID not found');
    
    const response = await api.post('/professions', {
      ...professionData,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Add Profession API error:', error);
    throw {
      error: 'Add profession failed',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

// New API method to fetch professionals
export const getProfessionalsByService = async (serviceName) => {
  try {
    const response = await api.get(`/professions?serviceName=${encodeURIComponent(serviceName)}`);
    return response.data;
  } catch (error) {
    console.error('Get Professionals API error:', error);
    throw {
      error: 'Failed to fetch professionals',
      message: error.response?.data?.message || error.message,
      details: error.response?.data,
    };
  }
};

export default api;