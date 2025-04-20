import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar, { PageTransition } from "../navbar";
import { Box, Button, Container } from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from 'react-i18next';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const isHomePage = location.pathname === "/";

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav>
        <Navbar transparentOnHome={isHomePage} />
      </nav>
      <Box
        component="div"
        sx={{
          position: "relative",
          pt: isHomePage ? 0 : "80px", // Height of your AppBar
          minHeight: "100vh",
          width: "100%"
        }}
      >
        {!isHomePage && (
          <Container maxWidth="xl" sx={{ py: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
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
            </motion.div>
          </Container>
        )}
        <main>
          <Outlet />
        </main>
      </Box>
    </>
  );
};

export default Layout;