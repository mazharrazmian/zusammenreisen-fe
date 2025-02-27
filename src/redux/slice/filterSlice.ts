import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postServices from "../api/postService";
import { Country } from "../../types";

interface filterStateInterface {
    countries : Array<Country>,
    loading : string,
    error : null | any
}

const initialState : filterStateInterface = {
  countries: [],
  loading: "idle",
  error: null,
};

export const get_AllCountries = createAsyncThunk(
  "filter/get_AllCountries",
  async (_, { rejectWithValue }) => {
    try {
      const res = await postServices.getAllCountries();

      return res.data; // Only return the serializable data
    } catch (error : any) {
      console.error(error);
      // Use `rejectWithValue` to pass only serializable error data
      return rejectWithValue(error.response?.data || "Something went wrong");
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
      state.countries = action.payload; // Only serializable data
    });
    builder.addCase(get_AllCountries.rejected, (state, action : any) => {
      state.loading = "rejected";
      state.error = action.payload; // Handle the serialized error
      state.countries = []; // Reset data on error
    });
  },
});

export default filterSlice.reducer;
