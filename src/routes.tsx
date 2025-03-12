import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/homePage";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Details from "./pages/postDetails";
import AddPost from "./pages/addPost";
import ChatPage from "./pages/chatPage";
import EditPost from "./pages/editPost";
import ProtectedRoute from "./hoc/protectedRoute";
import ActivateAccount from "./pages/activateAccount";
import ResetPassword from "./pages/passwordReset";
import ProfilePage from "./pages/accountPage";
import TravelBuddyBlog from "./pages/blogList";
import CreateTour from "./pages/createTour";
import RequestManagementTab from "./pages/requestManagement";

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
      { path: "requests", element: <RequestManagementTab/> },
      {path : "blog",element : <TravelBuddyBlog/>},
    //   { 
    //     path: "add/post", 
    //     element: (
    //       <ProtectedRoute>
    //         <AddPost />
    //       </ProtectedRoute>
    //     ) 
    //   },
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
