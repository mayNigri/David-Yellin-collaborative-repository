import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    userDoc: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserDoc: (state, action) => {
      state.userDoc = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setUserDoc } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectUserDoc = (state) => state.auth.userDoc;

export default authSlice.reducer;
