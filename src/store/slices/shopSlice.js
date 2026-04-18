import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import { getMe } from './authSlice';

export const getShopItems = createAsyncThunk('shop/getAll', async (_, thunkAPI) => {
  try {
    const res = await api.get('/shop');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const createShopItem = createAsyncThunk('shop/create', async (data, thunkAPI) => {
  try {
    const res = await api.post('/shop', data);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteShopItem = createAsyncThunk('shop/delete', async (id, thunkAPI) => {
  try {
    const res = await api.delete(`/shop/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const buyItem = createAsyncThunk('shop/buy', async (id, thunkAPI) => {
  try {
    const res = await api.post(`/shop/${id}/buy`);
    thunkAPI.dispatch(getMe()); // update user XP
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

const shopSlice = createSlice({
  name: 'shop',
  initialState: { items: [], isLoading: false, pendingActions: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getShopItems.pending, (state) => { state.isLoading = true; })
      .addCase(getShopItems.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(getShopItems.rejected, (state) => { state.isLoading = false; })
      .addCase(createShopItem.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      
      .addCase(deleteShopItem.pending, handlePendingAction)
      .addCase(deleteShopItem.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        state.items = state.items.filter(i => i._id !== action.payload.id);
      })
      .addCase(deleteShopItem.rejected, handleFulfilledOrRejectedAction)
      
      .addCase(buyItem.pending, handlePendingAction)
      .addCase(buyItem.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.items.findIndex(i => i._id === action.payload.item._id);
        if (index !== -1) state.items[index] = action.payload.item;
      })
      .addCase(buyItem.rejected, handleFulfilledOrRejectedAction);
  }
});

export default shopSlice.reducer;
