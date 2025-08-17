import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import ProfileCompletionBanner from "../components/shared/profileCompletion/ProfileCompletionBanner";
import { useAppSelector } from "../redux/store";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const profile = useAppSelector((s)=>s.profile);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    console.log("Token:", token);
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
        {/* You can replace this with your actual loading spinner component */}
      </div>
    );
  }

  // If authenticated, render the wrapped component
  if (isAuthenticated) {
    console.log(profile)
  return (
    <>
      <ProfileCompletionBanner
        isProfileCompleted={profile?.profile?.profile?.is_completed || false}
        completionPercentage={60}
        missingFields={['age', 'languages', 'gender']}
        profileUrl={`/profile/${profile?.profile?.profile?.id}`}
      />
      {children}
    </>
  );
}

  // If not authenticated, redirect to login with the current location
  // The login page can use this to redirect back after successful login
  return (
    <Navigate 
      to="/login" 
      state={{ from: location.pathname + location.search }} 
      replace 
    />
  );
};

export default ProtectedRoute;