import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { getMe } from "./authSlice";

export const getTaxes = createAsyncThunk(
  "taxes/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/taxes");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const createTax = createAsyncThunk(
  "taxes/create",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/taxes", data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const deleteTax = createAsyncThunk(
  "taxes/delete",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/taxes/${id}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const applyTax = createAsyncThunk(
  "taxes/apply",
  async (id, thunkAPI) => {
    try {
      const res = await api.post(`/taxes/${id}/apply`);
      thunkAPI.dispatch(getMe());
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const resetTax = createAsyncThunk(
  "taxes/reset",
  async (id, thunkAPI) => {
    try {
      const res = await api.post(`/taxes/${id}/reset`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const handlePendingAction = (state, action) => {
  state.pendingActions.push({
    id: action.meta.arg,
    type: action.type.split("/")[1],
  });
};

const handleFulfilledOrRejectedAction = (state, action) => {
  state.pendingActions = state.pendingActions.filter(
    (pending) =>
      !(
        pending.id === action.meta.arg &&
        pending.type === action.type.split("/")[1]
      ),
  );
};

const taxSlice = createSlice({
  name: "taxes",
  initialState: {
    taxes: [],
    isLoading: false,
    pendingActions: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaxes.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxes = action.payload;
      })
      .addCase(getTaxes.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(createTax.fulfilled, (state, action) => {
        state.taxes.unshift(action.payload);
      })

      .addCase(deleteTax.pending, handlePendingAction)
      .addCase(deleteTax.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        state.taxes = state.taxes.filter(
          (tax) => tax._id !== action.payload.id,
        );
      })
      .addCase(deleteTax.rejected, handleFulfilledOrRejectedAction)

      .addCase(applyTax.pending, handlePendingAction)
      .addCase(applyTax.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.taxes.findIndex(
          (tax) => tax._id === action.payload.tax._id,
        );
        if (index !== -1) {
          state.taxes[index] = action.payload.tax;
        }
      })
      .addCase(applyTax.rejected, handleFulfilledOrRejectedAction)

      .addCase(resetTax.pending, handlePendingAction)
      .addCase(resetTax.fulfilled, (state, action) => {
        handleFulfilledOrRejectedAction(state, action);
        const index = state.taxes.findIndex(
          (tax) => tax._id === action.payload._id,
        );
        if (index !== -1) {
          state.taxes[index] = action.payload;
        }
      })
      .addCase(resetTax.rejected, handleFulfilledOrRejectedAction);
  },
});

export default taxSlice.reducer;
