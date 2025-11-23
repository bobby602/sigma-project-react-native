// src/utils/api.js
// 🌐 Axios API Instance with Interceptors
// รองรับ AsyncStorage และ token refresh

import axios from 'axios';
import API_CONFIG from '../config/api';
import storage from './storage';

// สร้าง axios instance
const API = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag สำหรับป้องกัน refresh loop
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request Interceptor - เพิ่ม token
API.interceptors.request.use(
  async (config) => {
    try {
      // ดึง accessToken จาก AsyncStorage
      const accessToken = await storage.getItem('accessToken');
      
      if (accessToken) {
        // ลบ quotes ถ้ามี
        const cleanToken = typeof accessToken === 'string' 
          ? accessToken.replace(/^"+|"+$/g, '')
          : accessToken;
        
        config.headers.Authorization = `Bearer ${cleanToken}`;
        console.log('🔑 Added token to request:', config.url);
      }
      
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - จัดการ refresh token
API.interceptors.response.use(
  (response) => {
    // Success response
    console.log(`✅ API Success: ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ถ้าไม่ใช่ 401 หรือเคย retry แล้ว ให้ reject เลย
    if (error.response?.status !== 401 || originalRequest._retry) {
      console.error(`❌ API Error: ${error.config?.url}`, error.response?.status);
      return Promise.reject(error);
    }

    // ถ้ากำลัง refresh อยู่แล้ว ให้รอ
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log('🔄 Attempting token refresh...');
      
      // ดึง refresh token และ user info
      const refreshToken = await storage.getItem('refreshToken');
      const user = await storage.getItem('user');
      
      if (!refreshToken || !user) {
        throw new Error('No refresh token or user data');
      }

      const cleanRefreshToken = typeof refreshToken === 'string'
        ? refreshToken.replace(/^"+|"+$/g, '')
        : refreshToken;

      // เรียก refresh API
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
        {
          username: user.Login || user.Name,
          token: cleanRefreshToken,
        }
      );

      if (response.data?.success && response.data?.accessToken) {
        const newAccessToken = response.data.accessToken;
        
        // บันทึก token ใหม่
        await storage.setItem('accessToken', newAccessToken);
        
        // อัพเดท token ใน header
        API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        console.log('✅ Token refreshed successfully');
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        return API(originalRequest);
      } else {
        throw new Error('Invalid refresh response');
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
      
      processQueue(refreshError, null);
      isRefreshing = false;
      
      // ล้าง storage และ redirect ไป login
      await storage.clear();
      
      // TODO: Navigate to login screen
      // navigationRef.current?.navigate('Login');
      
      return Promise.reject(refreshError);
    }
  }
);

export default API;
