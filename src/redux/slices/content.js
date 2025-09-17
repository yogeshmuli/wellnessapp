import { createSlice } from "@reduxjs/toolkit";
import { fetchContent } from "../thunks/content";
import { RESET_APP } from "./global";

const initialState = {
  contentList: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: "contentSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(RESET_APP, (state) => {
      return initialState;
    });
    builder.addCase(fetchContent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchContent.fulfilled, (state, action) => {
      state.loading = false;
      state.contentList = action.payload;
    });
    builder.addCase(fetchContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default contentSlice.reducer;
