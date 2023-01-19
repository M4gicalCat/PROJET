import {themes} from "../themes";
import {createSlice} from "@reduxjs/toolkit";

export const ThemeSlice = createSlice({
  name: 'theme',
  initialState: themes[localStorage.getItem("theme") ?? "light"],
  reducers: {
    setTheme: (state, {payload}) => {
      state.theme = themes[payload];
      localStorage.setItem("theme", payload);
    },
  },
});

export const {setTheme} = ThemeSlice.actions;

export default ThemeSlice.reducer;