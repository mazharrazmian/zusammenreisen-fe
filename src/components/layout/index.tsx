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

  const handleChatOpen = () => {
    setOpenChat(true);
  };
  const accessToken = Cookies.get("accessToken");
  const handleChatClose = () => {
    setOpenChat(false);
  };

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
      {accessToken && (
        <Fab
          color="primary"
          aria-label="chat"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            width: "150px",
            borderRadius: "10px",
            display: { xs: "none", md: "flex" },
          }}
          onClick={() => navigate("/add/post")}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <AddCircleOutline />
            <Typography>Add Post</Typography>
          </Box>
        </Fab>
      )}
      {/* Chat Drawer */}
      {/* <ChatDrawer open={openChat} onClose={handleChatClose} /> */}
    </>
  );
};

export default Layout;
