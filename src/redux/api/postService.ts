import { callAPi, callAPiMultiPart } from "./http-common";

interface Post {
  travel_to_country: number | null; // Allows for null in case the value is optional
  travel_to_city: number | null; // Allows for null in case the value is optional
  date_from: string; // Use string if storing dates as ISO strings
  date_to: string;
  title: string;
  text: string;
}

const getAllPosts = (queryParams:string) => {
    return callAPi.get(`/reisapp/posts?${queryParams}`);

}
const getPost = (id: number) => callAPi.get(`/reisapp/posts/${id}`);
const getAllCountries = () => callAPi.get("/reisapp/countries/");
const filterCountryByName = (key: string) =>
  callAPi.get(`reisapp/countries/?name__startswith=${key}`);
const filterCityByCountryId = (id: string) =>
  callAPi.get(`reisapp/cities/?country=${id}`);
const createPost = (data: Post) =>
  callAPiMultiPart.post(`/reisapp/posts/`, data);
const editPost = (id: number, data) =>
  callAPiMultiPart.put(`/reisapp/posts/${id}`, data);

const postServices = {
  getAllPosts,
  getPost,
  createPost,
  getAllCountries,
  filterCityByCountryId,
  filterCountryByName,
  editPost,
};
export default postServices;
