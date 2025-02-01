import { callAPi, callAPiMultiPart, handleApiError } from "./http-common";

interface signup {
  email: string;
  password: string;
  re_password: string;
  profile: {
    gender: number;
    phone: number;
    picture: string;
  };
}
interface login {
  email: string;
  password: string;
}
export const signUp = async (data: signup) => {
    try {
      const response = await callAPiMultiPart.post("auth/users/", data);
      return response
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const login = async (data: login) => {
    try {
      const response = await callAPiMultiPart.post("auth/jwt/create/", data);
      return response
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const refresh = async (data: login) => {
    try {
      const response = await callAPiMultiPart.post("auth/jwt/refresh/", data);
      return response
    } catch (error) {
      handleApiError(error);
    }
  };
  
  export const getProfile = async () => {
    try {
      const response = await callAPi.get("auth/users/me");
      return response
    } catch (error) {
      handleApiError(error);
    }
  };

const authServices = {
  signUp,
  login,
  getProfile,
  refresh,
};
export default authServices;
