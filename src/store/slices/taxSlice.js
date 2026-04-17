import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { getMe } from './authSlice';

export const getTaxes = createAsyncThunk('taxes/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/taxes');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createTax = createAsyncThunk('taxes/create', async (data, thunkAPI) => {
  try {
    const res = await api.post('/taxes', data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateTax = createAsyncThunk('taxes/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/taxes/${id}`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteTax = createAsyncThunk('taxes/delete', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/taxes/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const applyTax = createAsyncThunk('taxes/apply', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/taxes/${id}/apply`);
    thunkAPI.dispatch(getMe());
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const taxSlice = createSlice({
  name: 'taxes',
  initialState: { taxes: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaxes.pending, (state) => { state.isLoading = true; })
      .addCase(getTaxes.fulfilled, (state, action) => { state.isLoading = false; state.taxes = action.payload; })
      .addCase(getTaxes.rejected, (state) => { state.isLoading = false; })
      .addCase(createTax.fulfilled, (state, action) => { state.taxes.unshift(action.payload); })
      .addCase(updateTax.fulfilled, (state, action) => {
        const index = state.taxes.findIndex(i => i._id === action.payload._id);
        if (index !== -1) state.taxes[index] = action.payload;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.taxes = state.taxes.filter(i => i._id !== action.payload.id);
      })
      .addCase(applyTax.fulfilled, (state, action) => {
        const index = state.taxes.findIndex(t => t._id === action.payload.tax._id);
        if (index !== -1) state.taxes[index] = action.payload.tax;
      });
  }
});

export default taxSlice.reducer;
