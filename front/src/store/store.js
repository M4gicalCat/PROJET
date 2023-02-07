import { configureStore } from '@reduxjs/toolkit';
import AuthenticateSlice from './AuthenticateSlice';
import ThemeSlice from './ThemeSlice';

export default configureStore({
  reducer: {
    auth: AuthenticateSlice,
    theme: ThemeSlice,
  },
});
