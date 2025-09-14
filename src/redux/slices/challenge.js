import { createSlice } from "@reduxjs/toolkit";
import { fetchChallenges } from "../thunks/challenge";
import { RESET_APP } from "./global";

const initialState = {
  challenges: [],
  loading: false,
  error: null,
};

const challengeSlice = createSlice({
  name: "challengeSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RESET_APP, (state) => {
        state = initialState;
      })
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
