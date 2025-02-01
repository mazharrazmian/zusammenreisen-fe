import "./App.css";
// import { scheduleTokenRefresh } from "./redux/api/http-common";
import Router from "./routes";
import ThemeProvider from "./theme";

function App() {
  // scheduleTokenRefresh();
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
