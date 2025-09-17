import { createSlice } from "@reduxjs/toolkit";
import { fetchHabits, fetchHabitDetails } from "../thunks/habits";
import { RESET_APP } from "./global";

const initialState = {
  habits: [],
  loading: false,
  habitDetails: null,
};

const habitsSlice = createSlice({
  name: "habitsSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RESET_APP, (state) => {
        return initialState;
      })
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload;
      })
      .addCase(fetchHabits.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setHabitDetails } = habitsSlice.actions;

export default habitsSlice.reducer;
