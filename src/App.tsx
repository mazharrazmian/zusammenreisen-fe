// App.tsx
import "./App.css";
import Router from "./routes";
import ThemeProvider from "./theme";
import { useEffect, useState } from "react";
import { get_profile } from "./redux/slice/profileSlice";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { get_AllCountries } from "./redux/slice/filterSlice";
import ScrollToTop from "./components/shared/scrollToTop/scrollToTop";
import OnboardingContainer from "./pages/onboarding/OnboardingContainer";
import Cookies from "js-cookie";
import { Box, CircularProgress, Typography } from "@mui/material";

function App() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = Cookies.get("accessToken");
        setIsAuthenticated(!!token);
        
        if (token) {
          await dispatch(get_profile());
        }
        
        await dispatch(get_AllCountries());
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Show loading spinner while initializing
  if (isLoading) {
    return (
      <ThemeProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: 2
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Check if authenticated user needs onboarding
  const needsOnboarding = isAuthenticated && 
                         profile?.profile?.profile && 
                         !profile.profile.profile.is_completed;

// If user needs onboarding, show full-screen onboarding
  if (needsOnboarding) {
    return (
      <ThemeProvider>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'background.default',
            zIndex: 9999,
            overflow: 'auto'
          }}
        >
          <OnboardingContainer 
            onComplete={() => {
              // Force a re-render by dispatching profile refresh
              dispatch(get_profile());
            }}
          />
        </Box>
      </ThemeProvider>
    );
  }

  // Normal app flow
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Router />
    </ThemeProvider>
  );
}

export default App;