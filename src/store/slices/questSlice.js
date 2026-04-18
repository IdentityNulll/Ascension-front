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

// We accept id explicitly to track which quest is pending loading state in extraReducers (action.meta.arg)
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
    thunkAPI.dispatch(getMe());
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

const handlePendingAction = (state, action) => {
  state.pendingActions.push({ id: action.meta.arg, type: action.type.split('/')[1] });
};

const handleFulfilledOrRejectedAction = (state, action) => {
  state.pendingActions = state.pendingActions.filter(
    (pending) => !(pending.id === action.meta.arg && pending.type === action.type.split('/')[1])
  );
};

const questSlice = createSlice({
  name: 'quests',
  initialState: { quests: [], isLoading: false, pendingActions: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuests.pending, (state) => { state.isLoading = true; })
      .addCase(getQuests.fulfilled, (state, action) => { state.isLoading = false; state.quests = action.payload; })
      .addCase(getQuests.rejected, (state) => { state.isLoading = false; })
      .addCase(createQuest.fulfilled, (state, action) => { state.quests.unshift(action.payload); })
      
      // Delete
      .addCase(deleteQuest.pending, handlePendingAction)
      .addCase(deleteQuest.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        state.quests = state.quests.filter(q => q._id !== action.payload.id);
      })
      .addCase(deleteQuest.rejected, handleFulfilledOrRejectedAction)
      
      // Increment
      .addCase(incrementQuest.pending, handlePendingAction)
      .addCase(incrementQuest.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.quests.findIndex(q => q._id === action.payload.quest._id);
        if (index !== -1) state.quests[index] = action.payload.quest;
      })
      .addCase(incrementQuest.rejected, handleFulfilledOrRejectedAction)
      
      // Decrement
      .addCase(decrementQuest.pending, handlePendingAction)
      .addCase(decrementQuest.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.quests.findIndex(q => q._id === action.payload._id);
        if (index !== -1) state.quests[index] = action.payload;
      })
      .addCase(decrementQuest.rejected, handleFulfilledOrRejectedAction)
      
      // Reset
      .addCase(resetQuest.pending, handlePendingAction)
      .addCase(resetQuest.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.quests.findIndex(q => q._id === action.payload._id);
        if (index !== -1) state.quests[index] = action.payload;
      })
      .addCase(resetQuest.rejected, handleFulfilledOrRejectedAction);
  }
});

export default questSlice.reducer;
