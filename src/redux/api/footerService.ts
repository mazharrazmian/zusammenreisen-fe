import { callAPi, handleApiError } from "./http-common";


const footerServices = {
   getBlog : async (slug : string) => {  
        try {
            const response = await callAPi.get(`/blogs/blogs/?category=${slug}&language=${localStorage.getItem('i18nextLng')}`);
            return response
        } catch (error) {
            handleApiError(error);
        }
    }
}
export default footerServices;
