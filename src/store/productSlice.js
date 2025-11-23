// src/store/productSlice.js
// 📦 Product Redux Slice for Mobile

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// ✅ Fetch Product List
export const fetchProductList = createAsyncThunk(
  'product/fetchList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const {
        page = 1,
        limit = 50,
        search = '',
        departCode = '',
        sortBy = 'ItemCode',
        sortOrder = 'ASC'
      } = params;

      console.log('📋 Fetching products:', { page, limit, search, departCode });

      const response = await API.get('/api/products/list', {
        params: {
          page,
          limit,
          search,
          departCode,
          sortBy,
          sortOrder
        }
      });

      console.log('✅ Products fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Fetch Product Detail
export const fetchProductDetail = createAsyncThunk(
  'product/fetchDetail',
  async (itemCode, { rejectWithValue }) => {
    try {
      console.log('🔍 Fetching product detail:', itemCode);
      
      const response = await API.get(`/api/products/${itemCode}`);
      
      console.log('✅ Product detail:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching product detail:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    productList: [],
    selectedProduct: null,
    currentRow: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 1,
    },
    filters: {
      search: '',
      departCode: '',
      sortBy: 'ItemCode',
      sortOrder: 'ASC',
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
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setCurrentRow: (state, action) => {
      state.currentRow = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProductList: (state) => {
      state.productList = [];
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Product List
      .addCase(fetchProductList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.result?.recordset || action.payload.data || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Product Detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  setSelectedProduct,
  setCurrentRow,
  clearError,
  resetProductList,
} = productSlice.actions;

export default productSlice.reducer;
