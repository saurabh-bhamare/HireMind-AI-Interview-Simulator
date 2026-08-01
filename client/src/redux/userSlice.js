import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {

    // ==========================================
    // SET USER
    // ==========================================
    setUser: (state, action) => {
      state.user = action.payload.user;

      state.token = action.payload.token;

      state.isAuthenticated = true;
    },

    // ==========================================
    // LOGOUT USER
    // ==========================================
    logoutUser: (state) => {
      state.user = null;

      state.token = null;

      state.isAuthenticated = false;
    },

    updateUser:(state,action)=>{

state.user = action.payload;

},

  },
});

// EXPORT ACTIONS
export const {
  setUser,
  logoutUser,
  updateUser,
} = userSlice.actions;

// EXPORT REDUCER
export default userSlice.reducer;