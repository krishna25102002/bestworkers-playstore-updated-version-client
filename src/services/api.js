// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.4:5000/api', // Your local IP
  //baseURL: 'https://bw-backends-v-2-0.onrender.com/api', // Your deployed server
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For debugging:
    // console.log('API Request:', config.method.toUpperCase(), config.url, config.headers.Authorization ? `Token: ${token.substring(0,10)}...` : 'No Token');
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Auth and User API methods
export const registerUser = async userData => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error.response ? error.response.data : error.message);
    throw error; // Re-throw the original error object for components to handle
  }
};

export const loginUser = async credentials => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const verifyOtp = async otpData => {
  try {
    console.log('Sending OTP verification request:', otpData);
    const response = await api.post('/auth/verify-otp', otpData);
    console.log('OTP verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('OTP verification API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const resendOtp = async ({ email }) => { // Ensure email is passed as an object
  try {
    const response = await api.post('/auth/resend-otp', { email });
    return response.data;
  } catch (error) {
    console.error('Resend OTP API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    // The interceptor will automatically add the token.
    // The backend's /auth/me route should use the token to identify the user.
    const response = await api.get('/auth/me');
    return response.data; // This should be { success: true, data: { ...user_details } }
  } catch (error) {
    console.error('Get User Profile API error:', error.response ? error.response.data : error.message);
    // Re-throw the error so the calling component (e.g., ProfileScreen) can handle it,
    // especially for 401 errors.
    throw error; // This will now include error.response if it's an HTTP error
  }
};

export const updateUserProfile = async userData => {
  try {
    // Assuming /users/update is a protected route, the interceptor will add the token
    const response = await api.put('/users/update', userData);
    return response.data;
  } catch (error) {
    console.error('Update Profile API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// This is for updating the extended professional profile details
export const updateProfessionalProfile = async (professionData) => {
  try {
    // The interceptor will add the token.
    // Backend's /professions/update (or similar) route should use req.user.id from the token.
    // Ensure your backend has a PUT route like '/professions/me' or '/professions/:id' or '/users/profile/professional'
    // that handles updating the professional details for the authenticated user.
    const response = await api.put('/professions/me', professionData); // Example endpoint, adjust to your backend
    return response.data;
  } catch (error) {
    console.error('Update Professional Profile API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};



export const changeUserPin = async pinData => {
  try {
    // Assuming /users/change-pin is a protected route
    const response = await api.put('/users/change-pin', pinData);
    return response.data;
  } catch (error) {
    console.error('Change PIN API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Profession API methods
export const addProfession = async (professionData) => {
  try {
    // The interceptor will add the token.
    // Backend's /professions route should use req.user.id from the token.
    // If your backend controller `professionController.js` still explicitly needs `userId` in `req.body`,
    // you'll need to fetch and send it. However, it's more secure for the backend to derive it from the token.
    // For now, assuming backend uses token:
    // const userId = await AsyncStorage.getItem('userID'); // Only if backend strictly needs it in body
    // if (!userId) throw new Error('User ID not found for adding profession');

    const response = await api.post('/professions', {
      ...professionData,
      // userId // Only include if backend controller requires it in the body and doesn't use req.user.id
    });
    return response.data;
  } catch (error) {
    console.error('Add Profession API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProfessionalsByService = async (serviceName, serviceCategory = null) => {
  try {
    let url = `/professions?serviceName=${encodeURIComponent(serviceName)}`;
    if (serviceCategory) {
      url += `&serviceCategory=${encodeURIComponent(serviceCategory)}`;
    }
    console.log("API.js: Calling URL:", url); // Add this log
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Get Professionals by Service/Category API error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const uploadProfileAvatar = async (formData) => {
  try {
    // Token is added by the interceptor
    const response = await api.put('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Avatar upload failed');
  }
};

// Helper to construct avatar URL
// The API_BASE_URL needs to be accessible from where api.js is imported or defined within api.js
const API_BASE_URL = api.defaults.baseURL; // Get base URL from axios instance
export const getAvatarUrl = (userId, timestamp = Date.now()) => {
  // Adding a timestamp query parameter to try and bust cache if image updates
  return `${API_BASE_URL}/users/${userId}/avatar?t=${timestamp}`;
};

// export const getProfessionalsByService = async (serviceName) => {
//   try {
//     // This is likely a public route, so token might not be strictly necessary,
//     // but the interceptor will add it if present, which is usually harmless.
//     const response = await api.get(`/professions?serviceName=${encodeURIComponent(serviceName)}`);
//     return response.data;
//   } catch (error) {
//     console.error('Get Professionals API error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

export default api;



// // api.js
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://192.168.1.3:5000/api',
//   //baseURL: 'https://bestworkers-server.onrender.com/api',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });
// //https://bestworkers-server.onrender.com

// // Existing auth and user API methods remain unchanged
// export const registerUser = async userData => {
//   try {
//     const response = await api.post('/auth/register', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Registration API error:', error);
//     throw {
//       error: 'Registration failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const loginUser = async credentials => {
//   try {
//     const response = await api.post('/auth/login', credentials);
//     return response.data;
//   } catch (error) {
//     console.error('Login API error:', error);
//     throw {
//       error: 'Login failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const verifyOtp = async otpData => {
//   try {
//     console.log('Sending OTP verification request:', otpData);
//     const response = await api.post('/auth/verify-otp', otpData);
//     console.log('OTP verification response:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('OTP verification API error:', error);
//     throw {
//       error: 'OTP verification failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const resendOtp = async email => {
//   try {
//     const response = await api.post('/auth/resend-otp', {email});
//     return response.data;
//   } catch (error) {
//     console.error('Resend OTP API error:', error);
//     throw {
//       error: 'Resend OTP failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const getUserProfile = async () => {
//   const userId = await AsyncStorage.getItem('userID');
//   const response = await api.get(`/auth/me?userId=${userId}`);
//   return response.data;
// };

// export const updateUserProfile = async userData => {
//   try {
//     const response = await api.put('/users/update', userData);
//     return response.data;
//   } catch (error) {
//     console.error('Update Profile API error:', error);
//     throw {
//       error: 'Update profile failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const changeUserPin = async pinData => {
//   try {
//     const response = await api.put('/users/change-pin', pinData);
//     return response.data;
//   } catch (error) {
//     console.error('Change PIN API error:', error);
//     throw {
//       error: 'Change PIN failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export const addProfession = async (professionData) => {
//   try {
//     const userId = await AsyncStorage.getItem('userID');
//     if (!userId) throw new Error('User ID not found');
    
//     const response = await api.post('/professions', {
//       ...professionData,
//       userId
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Add Profession API error:', error);
//     throw {
//       error: 'Add profession failed',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// // New API method to fetch professionals
// export const getProfessionalsByService = async (serviceName) => {
//   try {
//     const response = await api.get(`/professions?serviceName=${encodeURIComponent(serviceName)}`);
//     return response.data;
//   } catch (error) {
//     console.error('Get Professionals API error:', error);
//     throw {
//       error: 'Failed to fetch professionals',
//       message: error.response?.data?.message || error.message,
//       details: error.response?.data,
//     };
//   }
// };

// export default api;