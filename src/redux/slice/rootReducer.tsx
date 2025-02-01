import filterSlice from "./filterSlice";
import postSlice from "./postsSlice";
import profileSlice from "./profileSlice";
import chatSlice from "./chatSlice";

export const rootReducer = {
  posts: postSlice,
  filter: filterSlice,
  profile: profileSlice,
  chat: chatSlice,
};
