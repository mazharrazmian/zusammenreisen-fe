// hooks/useGoogleAuth.ts
import { useCallback } from 'react';
import authServices from '../redux/api/authService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { get_profile } from '../redux/slice/profileSlice';

interface GoogleAuthResponse {
  credential: string;
}

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get the page user was trying to access, default to home page
  const from = location.state?.from || "/";

  const handleGoogleSuccess = useCallback(async (response: GoogleAuthResponse) => {
    try {
      const res = await authServices.googleOAuth(response.credential);
      
      if (res?.status === 200) {
        // Store tokens in cookies (same as your regular login)
        Cookies.set("userId", res.data.id, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("accessToken", res.data.access, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("refreshToken", res.data.refresh, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });

        // Dispatch profile action (same as regular login)
        dispatch(get_profile());
        
        // Navigate to the page they were trying to access (same as regular login)
        navigate(from, { replace: true });
        
        // Show success message
        toast.success('Login successful!');
      }
    } catch (error: any) {
      // Handle specific error types like your regular login
      if (error?.response?.status === 400) {
        toast.error('Google authentication failed. Please try again.');
      } else if (error?.response?.status === 401) {
        toast.error('Invalid Google credentials.');
      } else {
        toast.error('Google authentication failed. Please try again.');
      }
      console.error('Google auth error:', error);
    }
  }, [navigate, dispatch, from]);

  const handleGoogleError = useCallback(() => {
    toast.error('Google authentication was cancelled.');
  }, []);

  return {
    handleGoogleSuccess,
    handleGoogleError,
  };
};