import { Outlet, useLocation } from "react-router-dom";
import Navbar, { PageTransition } from "../navbar";
import { Box } from "@mui/material";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
    <nav>
      <Navbar transparentOnHome={isHomePage} />
    </nav>
      <Box sx={{ 
        position : 'relative',
        marginTop: isHomePage ? 0 : "92px", // Only add padding when navbar is not transparent
        minHeight: "100vh"
      }}>
        <main>
        <Outlet />
        </main>
      </Box>
      
    </>
  );
};

export default Layout;