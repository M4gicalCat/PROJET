import {createSlice} from "@reduxjs/toolkit";

export const AuthenticateSlice = createSlice({
  name: 'auth',
  initialState: {},
  reducers: {
    setAccount: (state, {payload}) => {
      state.account = payload;
    },
    setAdmin: (state, {payload}) => {
      state.admin = payload;
    }
  },
});

export const {setAccount, setAdmin} = AuthenticateSlice.actions;

export default AuthenticateSlice.reducer;