import "./App.css";
import Navbar from "./components/navbar";
// import { scheduleTokenRefresh } from "./redux/api/http-common";
import Router from "./routes";
import ThemeProvider from "./theme";

function App() {
  // scheduleTokenRefresh();
  return (
    <ThemeProvider>
       <Navbar/>
      <Router />
    </ThemeProvider>
  );
}

export default App;
