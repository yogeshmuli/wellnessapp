import { createSlice } from "@reduxjs/toolkit";
import { fetchFriendRequests, fetchFriendsList } from "../thunks/friends";
import { RESET_APP } from "./global";

const initialState = {
  friendRequests: [],
  friendsList: [],
  loading: false,
  error: null,
};

const friendsSlice = createSlice({
  name: "friendsSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RESET_APP, (state) => {
        return initialState;
      })

      .addCase(fetchFriendRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
      })
      .addCase(fetchFriendRequests.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFriendsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFriendsList.fulfilled, (state, action) => {
        state.loading = false;
        state.friendsList = action.payload;
      })
      .addCase(fetchFriendsList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default friendsSlice.reducer;
