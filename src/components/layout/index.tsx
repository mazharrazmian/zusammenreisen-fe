import { Box, Container, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Footer from "../footer/footerComponent";
import Navbar from "../navbar";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const isHomePage = location.pathname === "/";
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
    // Update canGoBack on mount and location change
    setCanGoBack(window.history.length > 1);
  }, [location]);


    const handleGoBack = () => {
      navigate(-1);
    };
  
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <nav>
          <Navbar transparentOnHome={isHomePage} />
        </nav>
        <Box
          component="div"
          sx={{
            position: "relative",
            pt: isHomePage ? 0 : "80px", // Height of your AppBar
            flex: '1 0 auto', // This will make it take available space but allow footer to be visible
            width: "100%"
          }}
        >
          {!isHomePage && canGoBack && (
            <Container maxWidth="xl" sx={{ py: 2 }}>
              
                <Button
                  startIcon={<ArrowBack />}
                  onClick={handleGoBack}
                  sx={{
                    mb: 2,
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                  variant="text"
                >
                  {t('goBack')}
                </Button>
            </Container>
          )}
          <main>
            <Outlet />
          </main>
        </Box>
        <Footer  />
      </Box>
    );
  };


  export default Layout;