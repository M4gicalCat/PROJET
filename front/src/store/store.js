import { configureStore } from '@reduxjs/toolkit';
import AuthenticateSlice from "./AuthenticateSlice";

export default configureStore({
  reducer: {
    auth: AuthenticateSlice,
  },
});