import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { getMe } from './authSlice';

export const getQuests = createAsyncThunk('quests/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/quests');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createQuest = createAsyncThunk('quests/create', async (data, thunkAPI) => {
  try {
    const res = await api.post('/quests', data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateQuest = createAsyncThunk('quests/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/quests/${id}`, data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteQuest = createAsyncThunk('quests/delete', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/quests/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const incrementQuest = createAsyncThunk('quests/increment', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/quests/${id}/increment`);
    thunkAPI.dispatch(getMe()); // refresh XP
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const decrementQuest = createAsyncThunk('quests/decrement', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/quests/${id}/decrement`);
    thunkAPI.dispatch(getMe()); // refresh XP (if deducted)
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const resetQuest = createAsyncThunk('quests/reset', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/quests/${id}/reset`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

const questSlice = createSlice({
  name: 'quests',
  initialState: { quests: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuests.pending, (state) => { state.isLoading = true; })
      .addCase(getQuests.fulfilled, (state, action) => { state.isLoading = false; state.quests = action.payload; })
      .addCase(getQuests.rejected, (state) => { state.isLoading = false; })
      .addCase(createQuest.fulfilled, (state, action) => { state.quests.unshift(action.payload); })
      .addCase(updateQuest.fulfilled, (state, action) => {
        const index = state.quests.findIndex(q => q._id === action.payload._id);
        if (index !== -1) state.quests[index] = action.payload;
      })
      .addCase(deleteQuest.fulfilled, (state, action) => {
        state.quests = state.quests.filter(q => q._id !== action.payload.id);
      })
      .addCase(incrementQuest.fulfilled, (state, action) => {
        const index = state.quests.findIndex(q => q._id === action.payload.quest._id);
        if (index !== -1) state.quests[index] = action.payload.quest;
      })
      .addCase(decrementQuest.fulfilled, (state, action) => {
        const index = state.quests.findIndex(q => q._id === action.payload._id);
        if (index !== -1) state.quests[index] = action.payload;
      })
      .addCase(resetQuest.fulfilled, (state, action) => {
        const index = state.quests.findIndex(q => q._id === action.payload._id);
        if (index !== -1) state.quests[index] = action.payload;
      });
  }
});

export default questSlice.reducer;
