import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import chatServices from "../api/chatServices";

const initialState = {
  data: [],
  loading: "idle",
  error: null,
};

export const getChatRooms = createAsyncThunk(
  "chat/getChatRooms",
  async (email: string) => {
    try {
      const res = await chatServices.getChatRooms(email);
      
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getChatRooms.pending, (state) => {
      state.loading = "pending";
      state.error = null; // Reset error state
    });
    builder.addCase(getChatRooms.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload; // Reset error state
    });
    builder.addCase(getChatRooms.rejected, (state) => {
      state.loading = "rejected";
      state.data = []; // Reset error state
    });
  },
});

export default chatSlice.reducer;
