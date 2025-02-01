import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postServices from "../api/postService";

const initialState = {
  data: [],
  post: "",
  loading: "idle",
  error: null,
};

export const get_AllPosts = createAsyncThunk("posts/get_AllPosts", async () => {
  try {
    const res = await postServices.getAllPosts();
    return res.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
});

export const get_post = createAsyncThunk(
  "posts/get_posts",
  async (id: number) => {
    try {
      const res = await postServices.getPost(id);
      return res.data;
    } catch (error) {
      console.log(error);
      return error.response.data;
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(get_AllPosts.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(get_AllPosts.fulfilled, (state, action) => {
      (state.loading = "fulfilled"), (state.data = action.payload);
    });
    builder.addCase(get_AllPosts.rejected, (state, action) => {
      (state.loading = "rejected"),
        (state.data = null),
        (state.error = action.payload);
    });
    builder.addCase(get_post.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(get_post.fulfilled, (state, action) => {
      (state.loading = "fulfilled"), (state.post = action.payload);
    });
    builder.addCase(get_post.rejected, (state, action) => {
      (state.loading = "rejected"),
        (state.post = null),
        (state.error = action.payload);
    });
  },
});

export default postSlice.reducer;
