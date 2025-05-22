import "./App.css";
// import { scheduleTokenRefresh } from "./redux/api/http-common";
import Router from "./routes";
import ThemeProvider from "./theme";
import { useEffect } from "react";
import { get_profile } from "./redux/slice/profileSlice";
import { useAppDispatch } from "./redux/store";
import { get_AllCountries } from "./redux/slice/filterSlice";
import ScrollToTop from "./components/shared/scrollToTop/scrollToTop";


function App() {
  // scheduleTokenRefresh();
  const dispatch = useAppDispatch()
  // Fetch profile data once when the app loads
  useEffect(() => {
    dispatch(get_profile());
    dispatch(get_AllCountries())
  }, [dispatch]);


  return (
    <ThemeProvider>
      <ScrollToTop />
      <Router />
    </ThemeProvider>
  );
}

export default App;
