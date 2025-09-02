import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios";
import { getAuth } from "@react-native-firebase/auth";

export const fetchChallenges = createAsyncThunk(
  "challenges/fetchChallenges",
  async (params, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(
        `challenges/userChallenges/${userId}`,
        {
          params,
        }
      );

      return response.data; // Assuming the API returns an array of challenges
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to fetch challenge details
export const fetchChallengeDetails = createAsyncThunk(
  "challenges/fetchChallengeDetails",
  async (challengeId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(
        `/challenges/${challengeId}/userChallengeDetails/${userId}`
      );
      return response.data; // Assuming the API returns the challenge details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to join a challenge
export const joinChallenge = createAsyncThunk(
  "challenges/joinChallenge",
  async (challengeId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(
        `/challenges/${challengeId}/enroll`,
        { userId }
      );
      return response.data; // Assuming the API returns the updated challenge details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to change status of task
export const changeTaskStatus = createAsyncThunk(
  "challenges/changeTaskStatus",
  async ({ challengeId, taskId, status }, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.put(
        `/challenges/${challengeId}/tasks/${taskId}`,
        { userId, status }
      );
      return response.data; // Assuming the API returns the updated task details
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to add comment to challenge
// POST / challenges / 123 / comments;
export const addComment = createAsyncThunk(
  "challenges/addComment",
  async ({ challengeId, comment }, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(
        `/challenges/${challengeId}/comments`,
        { userId, content: comment }
      );
      return response.data; // Assuming the API returns the added comment
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to delete a comment
export const deleteComment = createAsyncThunk(
  "challenges/deleteComment",
  async ({ challengeId, commentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/challenges/${challengeId}/comments/${commentId}`
      );
      return response.data; // Assuming the API returns a success message or the deleted comment
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
