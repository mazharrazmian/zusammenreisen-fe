import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Divider, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { clearProfile } from "../../redux/slice/profileSlice";
import { toast } from "react-toastify";
import NotificationComponent from "./notification";
import { AnimatePresence, motion } from "framer-motion";
import MenuIcon from '@mui/icons-material/Menu'; // Import menu icon for sidebar toggle

import Iconify from "../iconify";
import { useAppSelector } from "../../redux/store";
import Logo from "../../assets/logo3.svg";
import { useTheme } from '@mui/material/styles';

// Motion button component for nav links
const MotionButton = motion(Button);

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
  
const Navbar = React.memo(({ transparentOnHome, onSidebarToggle }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [scrolled, setScrolled] = React.useState(false);
    const [previousPath, setPreviousPath] = React.useState(location.pathname);

    const profile = useAppSelector((s) => s?.profile);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const accessToken = Cookies.get("accessToken");
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    
    const handleLogout = () => {
        setAnchorElUser(null);
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("refreshToken", { path: "/" });
        dispatch(clearProfile())
        toast.success("Logout successful");
    };

    // Custom navigation function with animation
    const navigateWithAnimation = (path) => {
        setPreviousPath(location.pathname);
        sessionStorage.setItem("toursFilters", JSON.stringify({}));
        navigate(path);
    };

    // Handle sidebar toggle with debugging
    const handleSidebarToggle = (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log("Sidebar toggle clicked");
        if (onSidebarToggle) {
            onSidebarToggle();
        }
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
            sx={{
                background: !isTransparent ? "#fff" : "transparent",
                transition: "background 0.3s ease",
                boxShadow: !isTransparent ? "0px 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                padding: "1rem 0rem",
                width: '100%',
                zIndex: 1100,
                height:'auto',
            }}
        >
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ display: "flex", justifyContent: "space-between" }} // Changed to space-between for better layout
                >
                    {/* Sidebar toggle for mobile */}
                    {isMobile && (
                        <IconButton
                            onClick={handleSidebarToggle}
                            edge="start"
                            color={isTransparent ? "inherit" : "primary"}
                            aria-label="menu"
                            sx={{ 
                                mr: 2,
                                zIndex: 1300, // Ensure button is above other elements
                                position: "relative", // Ensure position context
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    
                    {/* Logo/App Name centered on mobile */}
                    <Box 
                        sx={{ 
                            display: { xs: 'flex' },
                            justifyContent: 'center',
                            height:'65px',
                            scale: 2,
                            marginTop: 1,
                            flexGrow: isMobile ? 0 : 1, // Only flex grow on non-mobile
                        }}
                        component={'img'}
                        src={Logo}
                    />
                    
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
                                    Add Post
                                </Button>
                            </Box>
                            <NotificationComponent
                                scrolled={scrolled}
                                profile={profile}
                                isTransparent={isTransparent}
                            />

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
                                    <MenuItem onClick={() => navigateWithAnimation('/account')}>
                                        <Typography sx={{ textAlign: "center", display: 'flex' }}>
                                            <Iconify icon={'mdi:home'} width={25} />
                                            Profile
                                        </Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography sx={{ textAlign: "center", color: "red" }}>
                                            Logout
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                    ) : (
                        <Stack spacing={2} direction={"row"}>
                            <Button 
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variant="outlined" 
                                onClick={() => navigateWithAnimation("/login")}
                                sx={{
                                    borderRadius: "8px",
                                    px: 3
                                }}
                            >
                                Log In
                            </Button>
                            <Button 
                                component={motion.button}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                variant="contained" 
                                onClick={() => navigateWithAnimation("/register")}
                                sx={{
                                    borderRadius: "8px",
                                    px: 3
                                }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
});

export default Navbar;