import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/homePage";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Details from "./pages/tripDetails";
import ChatPage from "./pages/chatPage";
import ProtectedRoute from "./hoc/protectedRoute";
import ActivateAccount from "./pages/activateAccount";
import ResetPassword from "./pages/passwordReset";
import CreateTour from "./pages/createTour";
import RequestManagementPage from "./pages/requestManagement";
import MyTripsPage from "./pages/tripPlannerList";
import TripPlannerPage from "./pages/tripPlannerDetail";
import { PageTransition } from "./components/navbar";
import ProfileDetail from "./pages/profileDetail";
import LegalPage from "./pages/blogPage";
import BlogPage from "./pages/blogPage";
import EditTour from "./pages/editTour";

export default function Router() {
    const routes = useRoutes([
      {
        element: <Layout />,
        children: [
          { path: "/", element: <PageTransition> <HomePage /> </PageTransition>, index: true },
          { path: "posts/:id", element: <Details /> },
          { path: "blog/:slug", element: <BlogPage /> },
          { 
            path: "add/post", 
            element: (
              <ProtectedRoute>
                <PageTransition>
                <CreateTour />
                </PageTransition>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "edit/post/:tourId", 
            element: (
              <ProtectedRoute>
                <PageTransition>
                <EditTour />
                </PageTransition>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "requests", 
            element: (
              <ProtectedRoute>
                <PageTransition>
                <RequestManagementPage />
                </PageTransition>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "tripplanner", 
            element: (
              <ProtectedRoute>
                <PageTransition>
                <MyTripsPage />
                </PageTransition>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "tripplanner/:id", 
            element: (
              <ProtectedRoute>
                <PageTransition>
                <TripPlannerPage />
                </PageTransition>
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
            path: "profile/:userId", 
            element: (
              <ProtectedRoute>
                <ProfileDetail />
              </ProtectedRoute>
            ) 
          },
          // add this path <Route path="/legal/:slug" element={<LegalPage />} />
         
          { path: "activate/:uid/:token", element: <ActivateAccount /> },
          { path: "password/reset/confirm/:uid/:token", element: <ResetPassword /> },
          { path: "404", element: <Page404 /> },
          { path: "*", element: <Navigate to="/404" replace /> },
        ],
      },
    ]);
  
    return routes;
  }