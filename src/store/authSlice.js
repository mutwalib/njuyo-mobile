import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk for initializing the authentication state
export const initAuth = createAsyncThunk('auth/init', async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
});

// Async thunk for logging in
export const login = createAsyncThunk('auth/login', async token => {
  await AsyncStorage.setItem('token', token);
  return token;
});

// Async thunk for logging out
export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.setItem('token', '');
});

// Define initial state
const initialState = {
  authToken: null,
};

// Create authentication slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(initAuth.fulfilled, (state, action) => {
        state.authToken = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authToken = action.payload;
      })
      .addCase(logout.fulfilled, state => {
        state.authToken = null;
      });
  },
});

export default authSlice.reducer;
