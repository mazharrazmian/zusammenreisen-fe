import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/navbar";
// import { scheduleTokenRefresh } from "./redux/api/http-common";
import Router from "./routes";
import ThemeProvider from "./theme";
import { useEffect } from "react";
import { get_profile } from "./redux/slice/profileSlice";
import { useAppDispatch } from "./redux/store";

function App() {
  // scheduleTokenRefresh();
  const dispatch = useAppDispatch()
  // Fetch profile data once when the app loads
  useEffect(() => {
    dispatch(get_profile());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
