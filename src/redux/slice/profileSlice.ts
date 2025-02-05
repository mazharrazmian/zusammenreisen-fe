import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import authServices from "../api/authService";

const initialState = {
  data: [],
  profile: "",
  loading: "idle",
  error: null,
};

export const get_profile = createAsyncThunk("profile/get_profile", async () => {
    if (Cookies.get('accessToken') == undefined){
        return
    } 
    try {
    const res = await authServices.getProfile();
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_profile.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(get_profile.fulfilled, (state, action) => {
      (state.loading = "fulfilled"), (state.profile = action.payload);
    });
    builder.addCase(get_profile.rejected, (state, action) => {
      (state.loading = "rejected"),
        (state.profile = null),
        (state.error = action.payload);
    });
  },
});

export default profileSlice.reducer;
