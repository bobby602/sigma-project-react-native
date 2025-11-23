// src/store/priceSlice.js
// 💰 Price Redux Slice for Mobile

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// ✅ Fetch Price List
export const fetchPriceList = createAsyncThunk(
  'price/fetchList',
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

      console.log('💰 Fetching prices:', { page, limit, search, departCode });

      const response = await API.get('/api/prices/list', {
        params: {
          page,
          limit,
          search,
          departCode,
          sortBy,
          sortOrder
        }
      });

      console.log('✅ Prices fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching prices:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update Price
export const updatePrice = createAsyncThunk(
  'price/update',
  async (priceData, { rejectWithValue }) => {
    try {
      console.log('💾 Updating price:', priceData);
      
      const response = await API.post('/api/prices/update', priceData);
      
      console.log('✅ Price updated:', response.data);
      return { ...priceData, ...response.data };
    } catch (error) {
      console.error('❌ Error updating price:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Batch Update Prices
export const batchUpdatePrices = createAsyncThunk(
  'price/batchUpdate',
  async (priceList, { rejectWithValue }) => {
    try {
      console.log('💾 Batch updating prices:', priceList.length);
      
      const response = await API.post('/api/prices/batch-update', {
        prices: priceList
      });
      
      console.log('✅ Batch update complete');
      return response.data;
    } catch (error) {
      console.error('❌ Error batch updating prices:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const priceSlice = createSlice({
  name: 'price',
  initialState: {
    priceList: [],
    selectedPrice: null,
    pendingChanges: {},
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
    isSaving: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setSelectedPrice: (state, action) => {
      state.selectedPrice = action.payload;
    },
    addPendingChange: (state, action) => {
      const { key, value } = action.payload;
      state.pendingChanges[key] = value;
    },
    clearPendingChanges: (state) => {
      state.pendingChanges = {};
    },
    removePendingChange: (state, action) => {
      delete state.pendingChanges[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPriceList: (state) => {
      state.priceList = [];
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Price List
      .addCase(fetchPriceList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPriceList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.priceList = action.payload.result?.recordset || action.payload.data || [];
        state.pagination = {
          ...state.pagination,
          ...action.payload.pagination,
        };
      })
      .addCase(fetchPriceList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Price
      .addCase(updatePrice.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        state.isSaving = false;
        // อัพเดทราคาใน list
        const index = state.priceList.findIndex(
          p => p.ItemCode === action.payload.ItemCode
        );
        if (index !== -1) {
          state.priceList[index] = {
            ...state.priceList[index],
            ...action.payload
          };
        }
      })
      .addCase(updatePrice.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      
      // Batch Update
      .addCase(batchUpdatePrices.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(batchUpdatePrices.fulfilled, (state) => {
        state.isSaving = false;
        state.pendingChanges = {};
      })
      .addCase(batchUpdatePrices.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  setSelectedPrice,
  addPendingChange,
  clearPendingChanges,
  removePendingChange,
  clearError,
  resetPriceList,
} = priceSlice.actions;

export default priceSlice.reducer;
