// src/hoc/protectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import OnboardingContainer from "../pages/onboarding/OnboardingContainer";
import { useAppSelector } from "../redux/store";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const profile = useAppSelector((s) => s.profile);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsAuthenticated(token !== undefined);
  }, []);

  // If authentication status is still loading, return loading spinner
  if (isAuthenticated === null) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname + location.search }} 
        replace 
      />
    );
  }

  // Check if authenticated user needs onboarding
  const needsOnboarding = profile?.profile?.profile && 
                         !profile.profile.profile.is_completed;

  if (needsOnboarding) {
    return (
      <OnboardingContainer 
        onComplete={() => {
          // The component will re-render automatically when profile state updates
          // No additional logic needed here
        }}
      />
    );
  }

  // If authenticated and profile is complete, render the protected content
  return children;
};

export default ProtectedRoute;