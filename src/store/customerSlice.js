// src/store/customerSlice.js
// 👥 Customer Redux Slice for Mobile

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// ✅ Fetch Customer List
export const fetchCustomerList = createAsyncThunk(
  'customer/fetchList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { page = 1, limit = 20, search = '' } = params;

      console.log('👥 Fetching customers:', { page, limit, search });

      const response = await API.get('/api/customers', {
        params: { page, limit, search }
      });

      console.log('✅ Customers fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching customers:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Fetch Customer Details
export const fetchCustomerDetails = createAsyncThunk(
  'customer/fetchDetails',
  async ({ code, date1, date2 }, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching customer details:', { code, date1, date2 });

      const response = await API.get(`/api/customers/${code}`, {
        params: { startDate: date1, endDate: date2 }
      });

      console.log('✅ Customer details:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching customer details:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customerList: [],
    selectedCustomer: null,
    customerDetails: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1,
    },
    filters: {
      search: '',
    },
    isLoading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setSelectedCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCustomerList: (state) => {
      state.customerList = [];
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customer List
      .addCase(fetchCustomerList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerList = action.payload.result?.recordset || action.payload.data || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchCustomerList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Customer Details
      .addCase(fetchCustomerDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerDetails = action.payload.finalResult || action.payload.data || [];
      })
      .addCase(fetchCustomerDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  setSelectedCustomer,
  clearError,
  resetCustomerList,
} = customerSlice.actions;

export default customerSlice.reducer;
