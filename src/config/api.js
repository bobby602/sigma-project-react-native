// src/config/api.js
// 🎯 API Configuration for Mobile App

const API_CONFIG = {
  // ✅ ใช้ IP เดียวกับ web app
  BASE_URL: 'http://18.140.210.192:9001', // AWS Lightsail IP
  // BASE_URL: 'http://localhost:9001', // Development
  
  ENDPOINTS: {
    // Authentication
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    
    // Products
    PRODUCTS: '/api/products',
    PRODUCT_LIST: '/api/products/list',
    
    // Prices
    PRICES: '/api/prices',
    PRICE_LIST: '/api/prices/list',
    PRICE_UPDATE: '/api/prices/update',
    
    // Customers
    CUSTOMERS: '/api/customers',
    CUSTOMER_LIST: '/api/customers',
    
    // Reservations
    RESERVATIONS: '/api/reservations',
    RESERVE_LIST: '/api/reservations/list',
    
    // Sales Summary
    SUMMARY: '/api/summary',
  },
  
  // Request Configuration
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export default API_CONFIG;
