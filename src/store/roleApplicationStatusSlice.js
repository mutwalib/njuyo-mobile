import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApplyAgent } from '../services/AuthServices';

export const roleApplicationStatus = createAsyncThunk(
  'applicationStatus/roleApplicationStatus',
  async (theUserId, { rejectWithValue }) => {
    try {
      const response = await getApplyAgent(theUserId);
      if (response.status === 200) {
        return true;
      } else {
        return rejectWithValue('Failed to fetch application status');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roleApplicationStatusSlice = createSlice({
  name: 'applicationStatus',
  initialState: {
    isApplied: false,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(roleApplicationStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(roleApplicationStatus.fulfilled, (state, action) => {
        state.isApplied = action.payload;
        state.status = 'succeeded';
      })
      .addCase(roleApplicationStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default roleApplicationStatusSlice.reducer;
