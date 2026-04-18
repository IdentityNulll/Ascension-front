import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const getRecords = createAsyncThunk('records/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/records');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const clearRecords = createAsyncThunk('records/clear', async (_, thunkAPI) => {
  try {
    const res = await api.delete('/records');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const recordSlice = createSlice({
  name: 'records',
  initialState: { records: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecords.pending, (state) => { state.isLoading = true; })
      .addCase(getRecords.fulfilled, (state, action) => { state.isLoading = false; state.records = action.payload; })
      .addCase(getRecords.rejected, (state) => { state.isLoading = false; })
      .addCase(clearRecords.fulfilled, (state) => { state.records = []; });
  }
});

export default recordSlice.reducer;
