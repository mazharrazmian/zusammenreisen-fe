import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import { Box, Fab, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat"; // Import the chat icon
import { useState } from "react";
import ChatDrawer from "../chat/index"; // Import the ChatDrawer
import { AddCircleOutline } from "@mui/icons-material";
import Cookies from "js-cookie";
const Layout = () => {
  const navigate = useNavigate();
  const [openChat, setOpenChat] = useState(false); // State for chat visibility

  return (
    <>
      <Navbar position="fixed" />
      <Outlet />
      {/* <Fab
        color="primary"
        aria-label="chat"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={() => navigate("/chat")}
      >
        <ChatIcon />
      </Fab> */}
      {/* Chat Drawer */}
      {/* <ChatDrawer open={openChat} onClose={handleChatClose} /> */}
    </>
  );
};

export default Layout;
