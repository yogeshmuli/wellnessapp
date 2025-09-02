import { createSlice } from "@reduxjs/toolkit";
import { fetchChallenges } from "../thunks/challenge";

const challengeSlice = createSlice({
  name: "challengeSlice",
  initialState: {
    challenges: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default challengeSlice.reducer;
