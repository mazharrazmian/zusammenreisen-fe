import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <App />
            <ToastContainer  autoClose={5000} position="bottom-center" theme="colored" />
          </Suspense>
        </Provider>
      </BrowserRouter>
    </HelmetProvider>
);
