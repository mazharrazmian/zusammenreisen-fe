import { Outlet } from "react-router-dom";
import Navbar from "../navbar";
const Layout = () => {

  return (
    <>
      <Navbar />
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
