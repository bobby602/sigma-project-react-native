// src/utils/helpers.js
// 🛠️ Helper Functions

/**
 * Debounce function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Format currency
 */
export const formatCurrency = (value) => {
  return parseFloat(value || 0).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Truncate text
 */
export const truncate = (str, length) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

/**
 * Parse DD/MM/YYYY to Date
 */
export const parseDDMMYYYY = (str) => {
  if (!str || typeof str !== 'string') return null;
  const [dd, mm, yyyy] = str.split('/');
  if (!dd || !mm || !yyyy) return null;
  return new Date(`${yyyy}-${mm}-${dd}`);
};

/**
 * Format Date to DD/MM/YYYY
 */
export const formatDDMMYYYY = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

/**
 * Get user role name
 */
export const getUserRole = (stAdmin) => {
  switch (stAdmin) {
    case '1':
      return 'ผู้ดูแลระบบ';
    case '2':
      return 'พนักงานขาย';
    case '3':
      return 'พนักงานทั่วไป';
    default:
      return 'ผู้ใช้งาน';
  }
};

/**
 * Sleep function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
