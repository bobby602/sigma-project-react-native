// src/store/index.js
// 🏪 Redux Store Configuration for Mobile

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import priceReducer from './priceSlice';
import customerReducer from './customerSlice';
import reserveReducer from './reserveSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    price: priceReducer,
    customer: customerReducer,
    reserve: reserveReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/checkAuth/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.lastLoginAttempt'],
      },
    }),
});

export default store;
