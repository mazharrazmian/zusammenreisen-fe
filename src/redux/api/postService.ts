import { callAPi, callAPiMultiPart } from "./http-common";


const getAllPosts = (queryParams:string) => {
    return callAPi.get(`/reisapp/posts?${queryParams}`);

}
const getPost = (id: number) => callAPi.get(`/reisapp/posts/${id}`);
const getAllCountries = () => callAPi.get("/reisapp/countries/");
const filterCountryByName = (key: string) =>
  callAPi.get(`reisapp/countries/?name__startswith=${key}`);
const filterCityByCountryId = (id: string) =>
  callAPi.get(`reisapp/cities/?country=${id}`);
const createPost = (data : any) =>
  callAPiMultiPart.post(`/reisapp/posts/`, data);
const editPost = (id: number, data : any) =>
  callAPiMultiPart.put(`/reisapp/posts/${id}/`, data);

const getFeaturedDestinations = async ()=>{
    return callAPi.get('/reisapp/destinations/')
}

const postServices = {
  getAllPosts,
  getPost,
  createPost,
  getAllCountries,
  filterCityByCountryId,
  filterCountryByName,
  editPost,
  getFeaturedDestinations,
};
export default postServices;
