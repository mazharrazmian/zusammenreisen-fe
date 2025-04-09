import { useDispatch } from "react-redux";
import "./App.css";
// import { scheduleTokenRefresh } from "./redux/api/http-common";
import Router from "./routes";
import ThemeProvider from "./theme";
import { useEffect } from "react";
import { get_profile } from "./redux/slice/profileSlice";
import { useAppDispatch } from "./redux/store";
import { get_AllCountries } from "./redux/slice/filterSlice";


// in AppProvider or App.js
import i18n from "./i18n";



function App() {
  // scheduleTokenRefresh();
  const dispatch = useAppDispatch()
  // Fetch profile data once when the app loads
  useEffect(() => {
    dispatch(get_profile());
    dispatch(get_AllCountries())
  }, [dispatch]);

  useEffect(() => {
    const domain = window.location.hostname;
    if (domain.includes("zusammenreisen")) {
      i18n.changeLanguage("de");
    } else {
      i18n.changeLanguage("en");
    }
  }, []);
  

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
