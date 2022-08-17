import { configureStore } from "@reduxjs/toolkit";
import messageReducer from './messages/slice'

export const store = configureStore({
  reducer: {
    message: messageReducer,
  },
});

