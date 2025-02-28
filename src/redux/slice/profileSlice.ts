import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

import authServices from "../api/authService";

const initialState = {
  profile: null,
  loading: "idle",
  error: null,
};

export const get_profile = createAsyncThunk("profile/get_profile", async () => {
    if (Cookies.get('accessToken') == undefined){
        return
    } 
    try {
    const res = await <any> authServices.getProfile();
    return res.data;
  } catch (error : any) {
    return error.response.data;
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
        state.profile = null;
        state.loading = 'idle';
        state.error = null;
      }
    },
  extraReducers: (builder) => {
    builder.addCase(get_profile.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(get_profile.fulfilled, (state, action) => {
      (state.loading = "fulfilled"), (state.profile = action.payload);
    });
    builder.addCase(get_profile.rejected, (state, action : any) => {
      (state.loading = "rejected"),
        (state.profile = null),
        (state.error = action.payload);
    });
  },
});
export const { clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
