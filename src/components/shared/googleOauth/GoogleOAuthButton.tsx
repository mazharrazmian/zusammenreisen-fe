// components/GoogleOAuthButton.tsx
import React, { useEffect } from "react";
import { useGoogleAuth } from "../../../hooks/googleAuth";

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleOauthButtonProps{
  text : 'signup_with' | 'signin_with'
}

const GoogleOAuthButton: React.FC<GoogleOauthButtonProps> = ({
    text = 'signin_with',
}) => {
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  
  useEffect(() => {
    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    function initializeGoogle() {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              // ✅ This is the ID token JWT
              handleGoogleSuccess(response);
            } else {
              handleGoogleError();
            }
          },
        });

        // Render Google's official button with custom styling
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { 
            theme: "outline", 
            size: "large", 
            text: text,
            width: "100%",
            shape: "rectangular"
          }
        );
      }
    }

    return () => {
      // Cleanup script if component unmounts
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [handleGoogleSuccess, handleGoogleError, text]);

  return (
    <div 
      id="google-signin-button" 
      style={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}
    />
  );
};

export default GoogleOAuthButton;