import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../services/api/api';

export const fetchPagedRentals = createAsyncThunk(
  'rentals/fetchPagedRentals',
  async ({ page, size }, thunkAPI) => {
    try {
      const response = await axiosClient.get(
        `/property/rentals?page=${page}&size=${size}`,
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

const pagedRentalsSlice = createSlice({
  name: 'rentals',
  initialState: {
    rentalsList: [],
    rentalsCount: 0,
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPagedRentals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagedRentals.fulfilled, (state, action) => {
        state.loading = false;
        state.rentalsList = action.payload.rentalsList;//[...state.rentalsList, ...action.payload.rentalsList];
        state.rentalsCount = action.payload.rentalsCount;
        state.currentPage = action.meta.arg.page;
        // Calculate total pages based on rentalsCount and page size
        state.totalPages = Math.ceil(action.payload.rentalsCount / action.meta.arg.size);
      })
      .addCase(fetchPagedRentals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  }
});

export default pagedRentalsSlice.reducer;
