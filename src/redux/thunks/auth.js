import {createAsyncThunk} from '@reduxjs/toolkit';

const user = {
  credentials: {username: 'admin', password: 'password@123'},
  details: {
    name: 'Admin User',
    email: 'admain@email.com',
    role: 'admin',
    token: 'auth_admin_token',
  },
};

export const login = createAsyncThunk('auth/login', async (model, thunkAPI) => {
  try {
    const response = await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          model.username === user.credentials.username &&
          model.password === user.credentials.password
        ) {
          resolve({status: 200, data: user.details});
        } else {
          reject({status: 401, message: 'Invalid credentials'});
        }
      }, 2000);
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});
