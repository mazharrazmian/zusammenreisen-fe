import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initialize as null to indicate loading

  useEffect(() => {
    const token = Cookies.get("accessToken");
    console.log("Token:", token); // Debugging
    setIsAuthenticated(token !== undefined); // Set to true if token exists, false otherwise
  }, []);

  console.log("isAuthenticated:", isAuthenticated); // Debugging

  // If authentication status is still loading, return null or a loading spinner
  if (isAuthenticated === null) {
    return null; // Or return a loading spinner
  }

  // If authenticated, render the wrapped component; otherwise, redirect to /404
  return isAuthenticated ? children : <Navigate to="/404" />;
};

export default ProtectedRoute;