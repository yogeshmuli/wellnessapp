import { createSlice } from "@reduxjs/toolkit";
import { fetchContent } from "../thunks/content";

const contentSlice = createSlice({
  name: "contentSlice",
  initialState: {
    contentList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
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
