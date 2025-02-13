import { Navigate, useRoutes } from "react-router-dom";
import Layout from "./components/layout";
import List from "./pages/list";
import HomePage from "./pages/homePgae";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import Details from "./pages/details";
import AddPost from "./pages/addPost";
import ChatPage from "./pages/chatPage";
import EditPost from "./pages/editPost";

export default function Router() {
    const routes = useRoutes([
      {
        path: "/",
        element: <Layout />,
        children: [
          { element: <HomePage />, index: true },
          { path: "list", element: <List /> },
        ],
      },
      { path: "details/:id", element: <Details /> },
      { path: "add/post", element: <AddPost /> },
      { path: "edit/post/:id", element: <EditPost /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "chat", element: <ChatPage /> },   // Chat without ID
      { path: "chat/:chatId", element: <ChatPage /> },  // Chat with ID
      { path: "404", element: <Page404 /> },
      { path: "*", element: <Navigate to="/404" replace /> },
    ]);
  
    return routes;
  }
  