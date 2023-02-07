import { themes } from '../themes';
import { createSlice } from '@reduxjs/toolkit';

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState: {
    ...themes[localStorage.getItem('theme') ?? 'light'],
    name: localStorage.getItem('theme') ?? 'light',
  },
  reducers: {
    setTheme: (state, { payload }) => {
      const newState = { ...themes[payload], name: payload };
      for (const prop in newState) {
        state[prop] = newState[prop];
      }
      localStorage.setItem('theme', payload);
    },
  },
});

export const { setTheme } = ThemeSlice.actions;

export default ThemeSlice.reducer;
