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
    return await callAPiMultiPart.post("auth/users/", data);
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
     console.log(error)
    }
  };

  export const updateProfile = async (id,data) => {
      const response = await callAPi.patch(`users/profile/${id}`,data=data);
      return response
  };

  export const getAllLanguages = async () =>{
    try {
        const response = await callAPiMultiPart.get("users/languages");
        return response
      } catch (error) {
        handleApiError(error);
      }
  }

  export const activateAccount = async ({uid,token}) =>{

    return callAPiMultiPart.post('/auth/users/activation/',{uid,token})
    
  }

  export const setPassword = async ({current_password,new_password} : {current_password:string,new_password:string}) =>{

    return callAPiMultiPart.post('/auth/users/set_password/',{current_password,new_password})
    
  }

  export const forgotPassword = async ({email} : {email:string}) =>{

    return callAPiMultiPart.post('/auth/users/reset_password/',{email})
    
  }

  export const resetPasswordConfirm = ({uid,token,password} : {uid:string,token:string,password:string}) =>{
    return callAPiMultiPart.post("/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: password,
      });
  }
  

const authServices = {
  signUp,
  login,
  getProfile,
  refresh,
  getAllLanguages,
  activateAccount,
  updateProfile,
  setPassword,
  forgotPassword,
  resetPasswordConfirm
};
export default authServices;
