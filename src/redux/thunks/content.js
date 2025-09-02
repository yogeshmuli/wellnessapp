import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios";

// fetch content thunk

export const fetchContent = createAsyncThunk(
  "content/fetch",
  async (model, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/content");

      return response.data;
    } catch (error) {
      console.error("Error fetching content:", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

// fetch content by id thunk

export const fetchContentById = createAsyncThunk(
  "content/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/content/${id}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching content by id:", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
