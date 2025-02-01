import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postServices from "../api/postService";

const initialState = {
  data: [],
  cities: [],
  loading: "idle",
  error: null,
};

export const get_AllCountries = createAsyncThunk(
  "filter/get_AllCountries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await postServices.getAllCountries();

      return res.data; // Only return the serializable data
    } catch (error) {
      console.error(error);
      // Use `rejectWithValue` to pass only serializable error data
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getCitiesByCId = createAsyncThunk(
  "filter/getCitiesByCId",
  async (id: number) => {
    try {
      const res = await postServices.filterCityByCountryId(id);

      return res.data; // Only return the serializable data
    } catch (error) {
      console.error(error);
      // Use `rejectWithValue` to pass only serializable error data
      return error.response?.data;
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_AllCountries.pending, (state) => {
      state.loading = "pending";
      state.error = null; // Reset error state
    });
    builder.addCase(get_AllCountries.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload; // Only serializable data
    });
    builder.addCase(get_AllCountries.rejected, (state, action) => {
      state.loading = "rejected";
      state.error = action.payload; // Handle the serialized error
      state.data = null; // Reset data on error
    });
    builder.addCase(getCitiesByCId.pending, (state) => {
      state.loading = "pending";
      state.error = null; // Reset error state
    });
    builder.addCase(getCitiesByCId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.cities = action.payload; // Only serializable data
    });
    builder.addCase(getCitiesByCId.rejected, (state, action) => {
      state.loading = "rejected";
      state.error = action.payload; // Handle the serialized error
      state.cities = null; // Reset data on error
    });
  },
});

export default filterSlice.reducer;
