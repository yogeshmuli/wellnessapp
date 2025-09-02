import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import axiosInstance from "../axios";
import storage from "@react-native-firebase/storage";

/**
 * @route PUT /users/:id
 * @summary Update a user by ID (Firebase UID)
 * @param {string} req.params.id - Firebase UID
 * @param {Object} req.body - Fields to update
 * @param {string} [req.body.displayName] - User's display name
 * @param {string} [req.body.tagLine] - User's tag line
 * @param {number} [req.body.age] - User's age
 * @param {string} [req.body.primaryGoal] - User's primary goal
 * @param {string[]} [req.body.interests] - User's interests
 * @param {string[]} [req.body.badges] - Array of badge IDs to set for the user
 * @returns {Object} 200 - Updated user object (with badges)
 * @returns {Object} 500 - Internal server error
 */

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const userId = getAuth().currentUser.uid;
      let photo = profileData.photoUrl || null;
      if (photo && photo.startsWith("file://")) {
        // upload image to firebase storage and get publicl url
        const response = await storage()
          .ref(`users/${userId}/profile.jpg`)
          .putFile(photo);
        photo = await storage()
          .ref(`users/${userId}/profile.jpg`)
          .getDownloadURL();
        profileData.photoUrl = `users/${userId}/profile.jpg`; // Update profileData with the new photo URL
      }
      const requestObject = {
        displayName: profileData.displayName,
        tagLine: profileData.tagLine,
        age: profileData.age,
        primaryGoal: profileData.primaryGoal,
        interests: profileData.interests,
        badges: profileData.badges,
        photoUrl: profileData.photoUrl, // Ensure photoUrl is included
      };

      const response = await axiosInstance.put(
        `/users/${userId}`,
        requestObject
      );
      return response.data; // Return updated user data
    } catch (error) {
      console.error("Error updating user profile:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (modal, thunkAPI) => {
    try {
      let userId = getAuth().currentUser.uid;

      const response = await axiosInstance.get(`/users/${userId}`);
      const userData = response.data;

      return userData; // Return user data to be used in the slice
      // Assuming userData contains the necessary fields
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
);
export const getOtherUser = createAsyncThunk(
  "auth/getOtherUser",
  async (modal, thunkAPI) => {
    try {
      let userId = modal?.userId;

      const response = await axiosInstance.get(`/users/${userId}`);
      const userData = response.data;

      return userData; // Return user data to be used in the slice
      // Assuming userData contains the necessary fields
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
);

// thunk to get all conversations

export const getAllConversations = createAsyncThunk(
  "friends/getAllConversations",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(
        `/users/${userId}/conversations`
      );
      // console.log("Fetched all conversations:", response.data);
      return response.data; // Assuming the API returns the conversation data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunl to get feed

export const getUserFeed = createAsyncThunk(
  "user/getFeed",
  async (_, thunkAPI) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(`/users/${userId}/feed`);
      return response.data; // Assuming the API returns the feed data
    } catch (error) {
      console.error("Error fetching user feed:", error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
