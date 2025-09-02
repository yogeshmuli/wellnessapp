import { createSlice } from "@reduxjs/toolkit";
import { fetchFriendRequests, fetchFriendsList } from "../thunks/friends";

const friendsSlice = createSlice({
  name: "friendsSlice",
  initialState: {
    friendRequests: [],
    friendsList: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
