import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../thunks/auth';

const authSlice = createSlice({
  name: 'authSlice',
  initialState: {
    name: null,
    email: null,
    token: null,
    role: null,
    error: null,
  },
  reducers: {
    setUser(state, action) {
      const {name, email, token, role} = action.payload;
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
      AsyncStorage.removeItem('user');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        authSlice.caseReducers.setUser(state, action);
        AsyncStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});

export const {setUser, logout} = authSlice.actions;
export default authSlice.reducer;
