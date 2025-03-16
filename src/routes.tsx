import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/homePage";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Details from "./pages/tourDetails";
import ChatPage from "./pages/chatPage";
import EditPost from "./pages/editTour";
import ProtectedRoute from "./hoc/protectedRoute";
import ActivateAccount from "./pages/activateAccount";
import ResetPassword from "./pages/passwordReset";
import ProfilePage from "./pages/accountPage";
import TravelBuddyBlog from "./pages/blogList";
import CreateTour from "./pages/createTour";
import RequestManagementPage from "./pages/requestManagement";
import MyTripsPage from "./pages/tripPlannerList";
import TripPlannerDetail from "./pages/tripPlannerDetail";

export default function Router() {
    const routes = useRoutes([
      {
        path: "/",
        element: <Layout />,
        children: [
          { element: <HomePage />, index: true },
        ],
      },
      { path: "posts/:id", element: <Details /> },
      {path : "blog",element : <TravelBuddyBlog/>},
      { 
        path: "add/post", 
        element: (
          <ProtectedRoute>
            <CreateTour />
          </ProtectedRoute>
        ) 
      },

      { 
        path: "edit/post/:tourId", 
        element: (
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "requests", 
        element: (
          <ProtectedRoute>
            <RequestManagementPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "mytrips", 
        element: (
          <ProtectedRoute>
            <MyTripsPage/>
          </ProtectedRoute>
        ) 
      },
      { 
        path: "mytrips/:id", 
        element: (
          <ProtectedRoute>
            <TripPlannerDetail/>
          </ProtectedRoute>
        ) 
      },

      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      { 
        path: "chat", 
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ) 
      },

      { 
        path: "chat/:chatId", 
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "account", 
        element: (
          <ProtectedRoute>
            <ProfilePage/>
          </ProtectedRoute>
        ) 
      },
      // Add Activation & Reset Password Routes
    { path: "activate/:uid/:token", element:  <ActivateAccount />},
    { path: "password/reset/confirm/:uid/:token", element:  <ResetPassword />},

      { path: "404", element: <Page404 /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ]);
  
    return routes;
}
