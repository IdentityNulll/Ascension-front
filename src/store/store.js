import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import questReducer from './slices/questSlice';
import shopReducer from './slices/shopSlice';
import taxReducer from './slices/taxSlice';
import ruleReducer from './slices/ruleSlice';
import recordReducer from './slices/recordSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quests: questReducer,
    shop: shopReducer,
    taxes: taxReducer,
    rules: ruleReducer,
    records: recordReducer,
  },
});
