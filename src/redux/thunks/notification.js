import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/index";
import { getAuth } from "@react-native-firebase/auth";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(`/notifications/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// mark as Read
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/notifications/read/${notificationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
