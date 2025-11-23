// src/store/authSlice.js
// 🔐 Authentication Redux Slice for Mobile
// ปรับให้ใช้ AsyncStorage แทน sessionStorage

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_CONFIG from '../config/api';
import storage from '../utils/storage';

// ✅ Helper functions
const safeJSONParse = (value) => {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const safeJSONStringify = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

// ✅ Login Async Thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      console.log('🚀 Login attempt:', username);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('📊 Response status:', response.status);

      if (response.status === 429) {
        throw new Error('ส่งคำขอมากเกินไป กรุณารอสักครู่');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }

      const data = await response.json();
      console.log('✅ Login response:', data);

      // Handle different response formats
      let user, accessToken, refreshToken;
      
      if (data.success) {
        user = data.user;
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
      } else if (data.result && data.result[0] && data.result[0][0]) {
        user = data.result[0][0];
        accessToken = data.accessToken || data.access_token || data.token;
        refreshToken = data.refreshToken || data.refresh_token;
      } else {
        throw new Error('รูปแบบการตอบกลับไม่ถูกต้อง');
      }
      
      if (!user || !accessToken) {
        throw new Error('ไม่พบข้อมูลผู้ใช้หรือ token');
      }

      // ✅ บันทึกข้อมูลลง AsyncStorage
      await Promise.all([
        storage.setItem('user', user),
        storage.setItem('token', user), // backward compatibility
        storage.setItem('accessToken', safeJSONStringify(accessToken)),
        refreshToken && storage.setItem('refreshToken', safeJSONStringify(refreshToken)),
      ]);

      console.log('💾 Login data saved to storage');

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return rejectWithValue(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  }
);

// ✅ Logout Async Thunk
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('🚪 Starting logout...');
      
      const state = getState();
      const accessToken = state.auth?.accessToken;
      
      // Call logout API if token exists
      if (accessToken) {
        try {
          const cleanToken = typeof accessToken === 'string'
            ? accessToken.replace(/^"+|"+$/g, '')
            : accessToken;
            
          await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${cleanToken}`,
            },
          });
          console.log('✅ Server logout successful');
        } catch (apiError) {
          console.warn('⚠️ Server logout failed (continuing local logout):', apiError);
        }
      }

      // ✅ Clear AsyncStorage
      await storage.clear();
      console.log('🧹 Storage cleared');

      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Check Auth Status (ใช้ตอน app เริ่มต้น)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔐 Checking auth status...');
      
      const [user, accessToken, refreshToken] = await Promise.all([
        storage.getItem('user'),
        storage.getItem('accessToken'),
        storage.getItem('refreshToken'),
      ]);

      if (!user || !accessToken) {
        throw new Error('No stored credentials');
      }

      console.log('✅ Found stored credentials');

      return {
        user: safeJSONParse(user),
        accessToken: safeJSONParse(accessToken),
        refreshToken: safeJSONParse(refreshToken),
      };
    } catch (error) {
      console.log('❌ No auth data found');
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    isInitialized: false, // ✅ track ว่าเช็ค auth แล้วหรือยัง
  },
  reducers: {
    // Update tokens
    updateTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
    },
    // Update user
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    // Manual logout
    manualLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
    },
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ====== Check Auth ======
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      
      // ====== Login ======
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      
      // ====== Logout ======
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // ถึงจะ error ก็ logout ให้
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { updateTokens, updateUser, manualLogout, clearError } = authSlice.actions;
export default authSlice.reducer;
