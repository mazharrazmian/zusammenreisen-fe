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
import TripPlannerPage from "./pages/tripPlannerDetail";
import MainLayout from "./components/shared/mainLayout";


export default function Router() {
    const routes = useRoutes([
      {
        element: <Layout />,
        children: [
          { 
            path: "/", 
            element: (
              <MainLayout>
                
                  <HomePage />
                
              </MainLayout>
            ), 
            index: true 
          },
          { 
            path: "posts/:id", 
            element: (
              <MainLayout>
                <Details />
              </MainLayout>
            ) 
          },
          { 
            path: "blog", 
            element: (
              <MainLayout>
                <TravelBuddyBlog />
              </MainLayout>
            ) 
          },
          { 
            path: "add/post", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  
                    <CreateTour />
                  
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "edit/post/:tourId", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  
                    <EditPost />
                  
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "requests", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  
                    <RequestManagementPage />
                  
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "tripplanner", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  
                    <MyTripsPage />
                  
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "tripplanner/:id", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  
                    <TripPlannerPage />
                  
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          // Auth pages without MainLayout
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { 
            path: "chat", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  <ChatPage />
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "chat/:chatId", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  <ChatPage />
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { 
            path: "account", 
            element: (
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            ) 
          },
          { path: "activate/:uid/:token", element: <ActivateAccount /> },
          { path: "password/reset/confirm/:uid/:token", element: <ResetPassword /> },
          { path: "404", element: <Page404 /> },
          { path: "*", element: <Navigate to="/404" replace /> },
        ],
      },
    ]);
  
    return routes;
  }