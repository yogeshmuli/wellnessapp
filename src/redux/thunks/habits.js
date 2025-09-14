import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/index";
import { getAuth } from "@react-native-firebase/auth";

export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(`/habits/?user=${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const enrollInHabit = createAsyncThunk(
  "habits/enrollInHabit",
  async ({ habitId }, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(`/habits/enroll`, {
        userId,
        habitId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const submitHabitRecord = createAsyncThunk(
  "habits/submitHabitRecord",
  async ({ habitId, comments }, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(`/habits/tracker`, {
        userId,
        habitId,
        comments,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// thunk to fetch habit details by ID
export const fetchHabitDetails = createAsyncThunk(
  "habits/fetchHabitDetails",
  async (habitId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/habits/${habitId}?user=${getAuth().currentUser.uid}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
