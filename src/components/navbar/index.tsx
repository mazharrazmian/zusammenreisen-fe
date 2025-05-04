import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Divider, Drawer, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../redux/slice/profileSlice";
import { toast } from "react-toastify";
import NotificationComponent from "./notification";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import { useTheme } from "@mui/material/styles";

import Iconify from "../iconify";
import { useAppSelector } from "../../redux/store";
import Sidebar from "./sidebar";

import LogoZusammenreisen from "../../assets/logo-zusammenreisen.svg";
import LogoWanderbuddies from '../../assets/logo-wanderbuddies.svg'
import LanguageSwitcher from "../shared/languageSwitcher/languageSwitcher";

// Define page transition variants
const pageTransitionVariants = {
    initial: {
        opacity: 0,
        x: 20
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        }
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: {
            duration: 0.2
        }
    }
};

// Motion button component for nav links
const MotionButton = motion(Button);

const Navbar = React.memo(({ transparentOnHome }) => {
    const { t, i18n } = useTranslation('navbar');
    console.log(i18n.language)
    const Logo = i18n.language == 'de' ? LogoZusammenreisen : LogoWanderbuddies
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
        null
    );
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
        null
    );
    const [languageAnchorEl, setLanguageAnchorEl] = React.useState<null | HTMLElement>(null);
    const [scrolled, setScrolled] = React.useState(false);
    const [previousPath, setPreviousPath] = React.useState(location.pathname);

    const profile: any = useAppSelector((s) => s?.profile);

    const pages = profile?.profile
        ? [
            { id: 1, pageName: t('home'), path: '/' },
            { id: 3, pageName: t('requests'), path: '/requests' },
            { id: 4, pageName: t('myTrips'), path: '/tripplanner' },
            { id: 5, pageName: t('chats'), path: '/chat' }
          ]
        : [
            { id: 1, pageName: t('home'), path: '/' }
          ];

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleLanguageMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setLanguageAnchorEl(event.currentTarget);
    };
    const handleLanguageMenuClose = () => {
        setLanguageAnchorEl(null);
    };
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        handleLanguageMenuClose();
    };

    const accessToken = Cookies.get("accessToken");
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleLogout = () => {
        setAnchorElUser(null);
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        dispatch(clearProfile())
        toast.success(t('logoutSuccess'));
    };

    // Custom navigation function with animation
    const navigateWithAnimation = (path) => {
        setPreviousPath(location.pathname);
        sessionStorage.setItem("toursFilters", JSON.stringify({}));
        navigate(path);
        handleCloseNavMenu();
    };

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Use transparentOnHome to determine background
    const isTransparent = transparentOnHome && !scrolled;

    return (
        <AppBar
                component={motion.div}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                position="fixed" // Add this to ensure it stays fixed
                sx={{
                    background: !isTransparent ? "#fff" : "transparent",
                    transition: "background 0.3s ease",
                    boxShadow: !isTransparent ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                    height: "70px", // Fixed height for AppBar
                    display: "flex",
                    alignItems: "center",
                    zIndex: 1100, // Add this to ensure it stays on top
                }}
            >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Box sx={{ display: "flex", justifyContent: "top" }}>

                        {/* // Desktop logo */}
                        <Box
                            component='img'
                            sx={{
                                height: '80px', // Fixed reasonable height
                                width: 'auto',  // Maintain aspect ratio
                                display: { xs: 'none', md: 'flex' },
                                cursor: 'pointer',
                                marginRight: 2,
                            }}
                            alt={t('travelMates')}
                            src={Logo}
                            onClick={() => navigateWithAnimation('/')}
                        />

                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                        <IconButton
                            size="large"
                            aria-label="open menu"
                            onClick={handleOpenNavMenu}
                            sx={{
                                color: "#000",
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Drawer
                            anchor="left"
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            <Box sx={{ width: 250 }}>
                                <Sidebar
                                    pages={pages}
                                    navigate={navigateWithAnimation}
                                    onClose={handleCloseNavMenu}
                                    handleLogout={handleLogout}
                                    Logo={Logo}
                                />
                               
                            </Box>
                        </Drawer>
                    </Box>
                    {/* // Mobile logo */}
                    {/* <Box
                            component='img'
                            sx={{
                                height: '50px', // Fixed reasonable height
                                width: 'auto',  // Maintain aspect ratio
                                display: { xs: 'flex', md: 'none' },
                                cursor: 'pointer',
                                marginRight: 2,
                            }}
                            alt={t('travelMates')}
                            src={Logo}
                            onClick={() => navigateWithAnimation('/')}
                        /> */}
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: "8px",
                            mx: 4
                        }}
                    >
                        {pages.map((page) => {
                            const isActive = location.pathname === page.path;

                            return (
                                <MotionButton
                                    key={page.id}
                                    href={page.path} // Set href to make it a real link
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigateWithAnimation(page.path);
                                    }}
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        mx: 1,
                                        color: "#000",
                                        position: "relative",
                                        fontWeight: isActive ? 600 : 400,
                                        letterSpacing: "0.5px",
                                        borderRadius: "8px",
                                        // Remove the border bottom and use underline animation instead
                                        borderBottom: "none",
                                        "&:hover": {
                                            backgroundColor: 
                                                 "rgba(0, 0, 0, 0.04)"
                                               
                                        }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {page.pageName}
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            initial={false}
                                            style={{
                                                position: "absolute",
                                                bottom: "0",
                                                left: "0",
                                                right: "0",
                                                height: "3px",
                                                borderRadius: "1.5px",
                                                backgroundColor: "#1976d2",
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 500,
                                                damping: 30
                                            }}
                                        />
                                    )}
                                </MotionButton>
                            );
                        })}
                    </Box>
                    {accessToken ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Box sx={{ flexGrow: 0 }}>
                                <Button
                                    component={motion.button}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    variant="contained"
                                    onClick={() => navigateWithAnimation('/add/post')}
                                    sx={{
                                        borderRadius: "8px",
                                        px: 3,
                                        fontWeight: 500
                                    }}
                                >
                                    {t('createTour')}
                                </Button>
                            </Box>
                            <NotificationComponent
                                scrolled={scrolled}
                                profile={profile}
                            />

                            {/* User Profile */}
                            {!isMobile && (
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title={''}>
                                        <IconButton
                                            component={motion.button}
                                            whileHover={{ scale: 1.1 }}
                                            onClick={handleOpenUserMenu}
                                            sx={{ p: 0 }}
                                        >
                                            <Avatar
                                                alt={profile?.profile?.name}
                                                src={profile?.profile?.profile?.picture}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: "45px", width: "250px" }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: "top",
                                            horizontal: "right",
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        <MenuItem>
                                            <Typography sx={{ textAlign: "center" }}>
                                                {profile?.profile?.name || "N/A"}
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem>
                                            <Typography sx={{ textAlign: "center" }}>
                                                {" "}
                                                {profile?.profile?.email || "N/A"}
                                            </Typography>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem onClick={() => navigateWithAnimation(`/profile/${profile?.profile?.profile?.id}`)}>
                                            <Typography sx={{ textAlign: "center", display: 'flex' }}>
                                                <Iconify icon={'mdi:home'} width={25} />
                                                {t('profile')}
                                            </Typography>
                                        </MenuItem>
                                        <MenuItem onClick={handleLogout}>
                                            <Typography sx={{ textAlign: "center", color: "red" }}>
                                                {t('logout')}
                                            </Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            )}
                            {/* Language Switcher */}
                           <LanguageSwitcher />
                        </Box>
                    ) : (

                        <Stack spacing={2} direction={"row"}>
                        {/* If not logged in, show login and signup buttons */}
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variant="outlined"
                                onClick={() => navigateWithAnimation("/login")}
                                sx={{
                                    borderRadius: "8px",
                                    px: 3,
                                    maxWidth: "80px",

                                }}
                                role="navigation"
                            >
                                {t('login')}
                            </Button>
                            <Button
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variant="contained"
                                onClick={() => navigateWithAnimation("/register")}
                                sx={{
                                    borderRadius: "8px",
                                    px: 3,
                                }}
                                role="navigation"
                            >
                                {t('signup')}
                            </Button>
                            {/* Language Switcher */}
                            
                                <LanguageSwitcher />
                        
                        </Stack>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
});

// Create a page transition wrapper component
export const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransitionVariants}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative' // Changed from 'absolute' to avoid layout issues
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default Navbar;