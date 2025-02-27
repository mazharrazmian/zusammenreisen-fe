import profileSlice from "./profileSlice";
import filterSlice from './filterSlice'
export const rootReducer = {
  profile: profileSlice,
  filter : filterSlice,
};
