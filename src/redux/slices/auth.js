import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, createUser, logout as LogoutThunk } from "../thunks/auth";
import Toast from "react-native-toast-message";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    name: null,
    email: null,
    token: null,
    role: null,
    error: null,
    registrationInProgress: false, // New state to track registration progress
  },
  reducers: {
    setUser(state, action) {
      const { name, email, token, role } = action.payload;
      state.token = token;
      state.role = role;
      state.name = name;
      state.email = email;
    },
    logout: (state, action) => {
      state.name = null;
      state.email = null;
      state.token = null;
      state.role = null;
      state.error = null;
      AsyncStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        authSlice.caseReducers.setUser(state, action);
        // Handle login success if needed
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload.message;
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: action.payload.message,
        });
      })
      .addCase(createUser.pending, (state) => {
        state.registrationInProgress = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        authSlice.caseReducers.setUser(state, action);
        state.registrationInProgress = false;
        // Handle user creation success if needed
        // AsyncStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload.message;
        Toast.show({
          type: "error",
          text1: "User Creation Failed",
          text2: action.payload.message,
        });
      })
      .addCase(LogoutThunk.fulfilled, (state) => {
        authSlice.caseReducers.logout(state);
        // Handle logout success if needed
        Toast.show({
          type: "success",
          text1: "Logout Successful",
          text2: "You have been logged out.",
        });
      })
      .addCase(LogoutThunk.rejected, (state, action) => {
        state.error = action.payload.message;
        Toast.show({
          type: "error",
          text1: "Logout Failed",
          text2: action.payload.message,
        });
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
