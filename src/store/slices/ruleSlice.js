import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { getMe } from './authSlice';

export const getRules = createAsyncThunk('rules/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/rules');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createRule = createAsyncThunk('rules/create', async (data, thunkAPI) => {
  try {
    const res = await api.post('/rules', data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateRule = createAsyncThunk('rules/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/rules/${id}`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteRule = createAsyncThunk('rules/delete', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/rules/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const breakRule = createAsyncThunk('rules/break', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/rules/${id}/break`);
    thunkAPI.dispatch(getMe());
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const ruleSlice = createSlice({
  name: 'rules',
  initialState: { rules: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRules.pending, (state) => { state.isLoading = true; })
      .addCase(getRules.fulfilled, (state, action) => { state.isLoading = false; state.rules = action.payload; })
      .addCase(getRules.rejected, (state) => { state.isLoading = false; })
      .addCase(createRule.fulfilled, (state, action) => { state.rules.unshift(action.payload); })
      .addCase(updateRule.fulfilled, (state, action) => {
        const index = state.rules.findIndex(r => r._id === action.payload._id);
        if (index !== -1) state.rules[index] = action.payload;
      })
      .addCase(deleteRule.fulfilled, (state, action) => {
        state.rules = state.rules.filter(r => r._id !== action.payload.id);
      })
      .addCase(breakRule.fulfilled, (state, action) => {
        const index = state.rules.findIndex(r => r._id === action.payload.rule._id);
        if (index !== -1) state.rules[index] = action.payload.rule;
      });
  }
});

export default ruleSlice.reducer;
