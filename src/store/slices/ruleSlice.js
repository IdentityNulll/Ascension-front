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

const handlePendingAction = (state, action) => {
  state.pendingActions.push({ id: action.meta.arg, type: action.type.split('/')[1] });
};

const handleFulfilledOrRejectedAction = (state, action) => {
  state.pendingActions = state.pendingActions.filter(
    (pending) => !(pending.id === action.meta.arg && pending.type === action.type.split('/')[1])
  );
};

const ruleSlice = createSlice({
  name: 'rules',
  initialState: { rules: [], isLoading: false, pendingActions: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRules.pending, (state) => { state.isLoading = true; })
      .addCase(getRules.fulfilled, (state, action) => { state.isLoading = false; state.rules = action.payload; })
      .addCase(getRules.rejected, (state) => { state.isLoading = false; })
      .addCase(createRule.fulfilled, (state, action) => { state.rules.unshift(action.payload); })
      
      .addCase(deleteRule.pending, handlePendingAction)
      .addCase(deleteRule.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        state.rules = state.rules.filter(r => r._id !== action.payload.id);
      })
      .addCase(deleteRule.rejected, handleFulfilledOrRejectedAction)
      
      .addCase(breakRule.pending, handlePendingAction)
      .addCase(breakRule.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.rules.findIndex(r => r._id === action.payload.rule._id);
        if (index !== -1) state.rules[index] = action.payload.rule;
      })
      .addCase(breakRule.rejected, handleFulfilledOrRejectedAction);
  }
});

export default ruleSlice.reducer;
