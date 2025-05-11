import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const API_URL = import.meta.env.VITE_API_URL;
export const CHAT_URL = import.meta.env.VITE_CHAT_URL;

const origin = window.location.origin;

export const callAPi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json",
    'Accept-Language': localStorage.getItem("i18nextLng") || "en",
    'X-Frontend-Host': origin, // e.g., "https://wanderbuddies.com"
  },
  
});

export const callAPiMultiPart = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "multipart/form-data",
    'Accept-Language':  localStorage.getItem('i18nextLng') || "en",
    'X-Frontend-Host': origin, // e.g., "https://wanderbuddies.com"

  },
});

// Extract error message from DRF standardized errors & handle network errors
export const handleApiError = (error: any) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // API returned an error response (e.g., 400, 401, 500)
        const errorData = error.response.data;
        if (errorData?.type == 'validation_error'){
            if (errorData?.errors?.length) {
                toast.error(`${errorData.errors[0].attr} : ${errorData.errors[0].detail}`|| "Something went wrong!");
              } else {
                toast.error("An unexpected error occurred.");
              }
        }
        else if (errorData?.type == 'client_error') {
                if (errorData?.errors?.length) {
                    toast.error(`${errorData.errors[0].detail}`|| "Something went wrong!");
                  } else {
                    toast.error("An unexpected error occurred.");
                  }
        }
        else{
            toast.error('Something went wrong')
        }
        
      } else if (error.request) {
        // API is down or no response received
        toast.error("Cannot connect to the server. Please try again later.");
      }
    } else {
      // Non-Axios error (unexpected case)
      toast.error("An unknown error occurred.");
    }
    throw error; // Re-throw for additional handling if needed
  };

const attachAuthorizationHeader = (config: any) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `JWT ${accessToken}`;
  }
  return config;
};

// Attach request interceptors
callAPi.interceptors.request.use(attachAuthorizationHeader, (error) =>
  Promise.reject(error)
);
callAPiMultiPart.interceptors.request.use(attachAuthorizationHeader, (error) =>
  Promise.reject(error)
);

// Add response interceptors to handle token expiration
const handleTokenExpiration = async (error: any) => {
  const originalRequest = error.config;

  if (
    error.response &&
    error.response.data &&
    error.response.data.errors &&
    error.response.data.errors.some(
      (err: any) => err.code === "token_not_valid"
    ) &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;

    try {
      // Send refresh token API
      const refreshToken = Cookies.get("refreshToken");
      const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      Cookies.set("accessToken", newAccessToken); // Save the new access token in cookies

      // Update the Authorization header in the original request
      originalRequest.headers.Authorization = `JWT ${newAccessToken}`;

      // Retry the original request
      return callAPi(originalRequest);
    } catch (refreshError) {
      console.error("Failed to refresh token:", refreshError);
      // Optionally, handle logout or token refresh failure
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/login"; // Redirect to login
      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
};

// Attach response interceptors
callAPi.interceptors.response.use(
  (response) => response,
  handleTokenExpiration
);

callAPiMultiPart.interceptors.response.use(
  (response) => response,
  handleTokenExpiration
);
