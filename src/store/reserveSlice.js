// src/store/reserveSlice.js
// 📋 Reservation Redux Slice for Mobile

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../utils/api';

// ✅ Fetch Reservations
export const fetchReservations = createAsyncThunk(
  'reserve/fetchList',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { itemCode, saleName, nameFGS, code } = params;

      console.log('📋 Fetching reservations:', params);

      if (!itemCode || !saleName) {
        throw new Error('Missing required parameters: itemCode and saleName');
      }

      const response = await API.get('/api/reservations/list', {
        params: { itemCode, saleName, nameFGS, code }
      });

      console.log('✅ Reservations fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching reservations:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Create Reservation
export const createReservation = createAsyncThunk(
  'reserve/create',
  async (reservationData, { rejectWithValue }) => {
    try {
      console.log('💾 Creating reservation:', reservationData);

      const response = await API.post('/api/reservations', reservationData);

      console.log('✅ Reservation created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating reservation:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Update Reservation
export const updateReservation = createAsyncThunk(
  'reserve/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('💾 Updating reservation:', id, data);

      const response = await API.put(`/api/reservations/${id}`, data);

      console.log('✅ Reservation updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating reservation:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Delete Reservation
export const deleteReservation = createAsyncThunk(
  'reserve/delete',
  async (id, { rejectWithValue }) => {
    try {
      console.log('🗑️ Deleting reservation:', id);

      const response = await API.delete(`/api/reservations/${id}`);

      console.log('✅ Reservation deleted');
      return id;
    } catch (error) {
      console.error('❌ Error deleting reservation:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reserveSlice = createSlice({
  name: 'reserve',
  initialState: {
    reservations: [],
    selectedReservation: null,
    isLoading: false,
    isSaving: false,
    error: null,
  },
  reducers: {
    setSelectedReservation: (state, action) => {
      state.selectedReservation = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetReservations: (state) => {
      state.reservations = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reservations
      .addCase(fetchReservations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReservations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reservations = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
      })
      .addCase(fetchReservations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Reservation
      .addCase(createReservation.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      
      // Update Reservation
      .addCase(updateReservation.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateReservation.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.reservations.findIndex(
          r => r.id === action.payload.id
        );
        if (index !== -1) {
          state.reservations[index] = action.payload;
        }
      })
      .addCase(updateReservation.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })
      
      // Delete Reservation
      .addCase(deleteReservation.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(deleteReservation.fulfilled, (state, action) => {
        state.isSaving = false;
        state.reservations = state.reservations.filter(
          r => r.id !== action.payload
        );
      })
      .addCase(deleteReservation.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSelectedReservation,
  clearError,
  resetReservations,
} = reserveSlice.actions;

export default reserveSlice.reducer;
