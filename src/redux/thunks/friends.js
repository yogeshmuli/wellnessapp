import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios";
import { getAuth } from "@react-native-firebase/auth";

export const fetchFriendsList = createAsyncThunk(
  "friends/fetchFriendsList",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(`/users/${userId}/friends`);
      // console.log("Fetched friends list:", response.data);
      return response.data;
      // Assuming the API returns an array of friends
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch friend requests
export const fetchFriendRequests = createAsyncThunk(
  "friends/fetchFriendRequests",
  async (_, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(
        `/users/${userId}/friend-requests`
      );
      // console.log("Fetched friend requests:", response.data);
      return response.data; // Assuming the API returns an array of friend requests
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to send friend request
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async (friendId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(
        `/users/${userId}/friend-requests`,
        {
          receiverId: friendId,
        }
      );
      // console.log("Sent friend request:", response.data);
      return response.data; // Assuming the API returns the updated friend request status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// thunk to accept friend request
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(
        `/users/${userId}/friend-requests/${requestId}/accept`
      );
      // console.log("Accepted friend request:", response.data);
      return response.data; // Assuming the API returns the updated friend status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
// thunk to reject friend request
export const rejectFriendRequest = createAsyncThunk(
  "friends/rejectFriendRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.post(
        `/users/${userId}/friend-requests/${requestId}/reject`
      );
      // console.log("Rejected friend request:", response.data);
      return response.data; // Assuming the API returns the updated friend status
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to unfriend
export const unfriend = createAsyncThunk(
  "friends/unfriend",
  async (friendId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.delete(
        `/users/${userId}/friends/${friendId}`
      );
      // console.log("Unfriended user:", response.data);
      return response.data; // Assuming the API returns the updated friends list
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchFriends = createAsyncThunk(
  "friends/searchFriends",
  async (query, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(`/users/${userId}/search`, {
        params: { query },
      });
      // console.log("Searched friends:", response.data);
      return response.data; // Assuming the API returns an array of users
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to get conversation

export const getConversation = createAsyncThunk(
  "friends/getConversation",
  async (friendId, { rejectWithValue }) => {
    try {
      const userId = getAuth().currentUser.uid;
      const response = await axiosInstance.get(
        `/conversations/between/${userId}/${friendId}`
      );
      // console.log("Fetched conversation:", response.data);
      return response.data; // Assuming the API returns the conversation data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// thunk to get messages

export const getMessages = createAsyncThunk(
  "friends/getMessages",
  async (model, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/conversations/${model.conversationId}/messages?cursor=${model.cursor}`
      );
      // console.log("Fetched messages:", response.data);
      return response.data; // Assuming the API returns the messages
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
