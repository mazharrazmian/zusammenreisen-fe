import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Typography, CircularProgress, Drawer, IconButton, Pagination, Chip, Stack, useMediaQuery, Paper, Avatar, Divider, Badge } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { homePageStyles } from "./styles";
//import tourServices from "../redux/api/tourService";
import { useNavigate, useSearchParams } from "react-router-dom";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
//import TourFilters from "../components/tourFilters";
import { FilterState } from "../types";
import { toast } from "react-toastify";
import ExploreIcon from "@mui/icons-material/Explore";
import HikingIcon from "@mui/icons-material/Hiking";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CommentIcon from "@mui/icons-material/Comment";
import Filters from "../components/filters";
import postServices from "../redux/api/postService";
import { useAppSelector } from "../redux/store";
import TripList from "../components/tourList";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import { AnimateWrapper, animationConfig } from "../components/animations/animateWrapper";
import { useTranslation } from "react-i18next";
const HomePage: React.FC = () => {
    const isMobile = useMediaQuery("(max-width: 960px)");
    const profile = useAppSelector((s) => s.profile);
    const { t } = useTranslation(['homepage']);
    

    // Tours list state
    const [posts, setPosts] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    // Get saved filters from session storage
    const getSavedFilters = () => {
        const savedFilters = sessionStorage.getItem("toursFilters");
        return savedFilters ? JSON.parse(savedFilters) : {};
    };

    const [filters, setFilters] = useState<FilterState>({
        country_to: searchParams.get("country_to") || getSavedFilters().country_to || "",
        city_to: searchParams.get("city_to") || getSavedFilters().city_to || "",
        country_from: searchParams.get("country_from") || getSavedFilters().country_from || "",
        city_from: searchParams.get("city_from") || getSavedFilters().city_from || "",
        gender: searchParams.get("gender") || getSavedFilters().gender || "",
        date_from: searchParams.get("date_from") || getSavedFilters().date_from || "",
        date_to: searchParams.get("date_to") || getSavedFilters().date_to || "",
        group_size: searchParams.get("group_size") || getSavedFilters().group_size || "",
        age_group: searchParams.get('age_group') || getSavedFilters().age_group || "",
        page: searchParams.get('page') || getSavedFilters().page || 1,
    });

    // Save filters whenever they change
    useEffect(() => {
        sessionStorage.setItem("toursFilters", JSON.stringify(filters));
    }, [filters]);

    const urlParams = new URLSearchParams({
        ...(filters.page && { page: String(filters.page) }),
        ...(filters.country_to && { country_to: filters.country_to }),
        ...(filters.city_to && { city_to: filters.city_to }),
        ...(filters.country_from && { country_from: filters.country_from }),
        ...(filters.city_from && { city_from: filters.city_from }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
        ...(filters.gender && { gender: String(filters.gender) }),
        ...(filters.group_size && { group_size: String(filters.group_size) }),
        ...(filters.age_group && { age_group: String(filters.age_group) }),
    }).toString();

    const fetchPosts = async () => {
        setSearchParams(urlParams);
        setLoading(true);
        try {
            const response = await postServices.getAllPosts(urlParams);
            setPosts(response.data.results);
            setCount(response.data.count);
            setIsInitialLoad(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch tours.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch tours when filters or page changes
    useEffect(() => {
        fetchPosts();
    }, [urlParams]);

    // Scroll to the top of the tours section when the page changes
    useEffect(() => {
        // Check if the page number has changed and if it's not the initial load
        if (isInitialLoad) return; // Skip on initial load
        if (filters.page) {
            document.getElementById('explore-tours')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [filters.page]);

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            page: value,
        }));
    };

    return (
        <motion.div {...animationConfig.page}>
            {/* Hero section with background and animated text */}
            <Box sx={homePageStyles.mainWrapper}>
                <AnimateWrapper {...animationConfig.heroTitle}>
                    <Typography
                        variant="h2"
                        sx={{
                            textAlign: 'center',
                            marginBottom: 3,
                            fontWeight: 700,
                            color: 'primary.dark', // Dark teal from your theme
                            maxWidth: { xs: '90%', md: '800px' }
                        }}
                    >
                        {t('welcome')}
                    </Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            textAlign: 'center',
                            marginBottom: 4,
                            fontWeight: 400,
                            color: 'grey.700', // Darker grey for contrast
                            maxWidth: { xs: '90%', md: '700px' }
                        }}
                    >
                        {t('join')}
                    </Typography>
                </AnimateWrapper>

                <Box sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}>
                    <AnimateWrapper {...animationConfig.heroButton(0.5)}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: "30px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: { xs: "0.9rem", sm: "1.1rem" },
                                padding: { xs: "10px 25px", sm: "12px 30px" },
                                boxShadow: "0 8px 16px rgba(42, 127, 126, 0.2)",
                                backgroundColor: "primary.main",
                                minWidth: '180px',
                                width: { xs: "100%", sm: "220px" },
                                "&:hover": {
                                    backgroundColor: "primary.dark",
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 12px 20px rgba(42, 127, 126, 0.3)"
                                },
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => document.getElementById('explore-tours').scrollIntoView({behavior: 'smooth'})} 
                            >
                            {t('exploreTour')}
                        </Button>
                    </AnimateWrapper>

                    <AnimateWrapper {...animationConfig.heroButton(0.7)}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{
                                borderRadius: "30px",
                                textTransform: "none",
                                fontWeight: "600",
                                fontSize: { xs: "0.9rem", sm: "1.1rem" },
                                padding: { xs: "10px 25px", sm: "12px 30px" },
                                borderColor: "secondary.main",
                                color: "secondary.main",
                                minWidth: '180px',
                                width: { xs: "100%", sm: "220px" },
                                "&:hover": {
                                    backgroundColor: "secondary.lighter",
                                    borderColor: "secondary.main",
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 12px 20px rgba(42, 79, 126, 0.2)"
                                },
                                transition: "all 0.3s ease"
                            }}
                            onClick={() => { 
                                profile?.profile ?  
                                navigate('/add/post') 
                                : 
                                navigate('/register') 
                              }} 
                        >
                            {t('createTour')}
                        </Button>

                    </AnimateWrapper>
                </Box>

                {/* Rest of the component remains the same */}
            </Box>

            {/* How It Works Section */}
            <Box sx={{ py: 6, backgroundColor: "#ffffff" }}>
                <Container maxWidth="lg">
                    <AnimateWrapper {...animationConfig.sectionTitle}>
                        <Typography
                            variant="h4"
                            sx={{
                                textAlign: 'center',
                                fontWeight: "bold",
                                mb: 5,
                                position: 'relative',
                                "&:after": {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -12,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 60,
                                    height: 3,
                                    backgroundColor: 'primary.main'
                                }
                            }}
                        >
                            {t('howItWorks')}
                        </Typography>
                    </AnimateWrapper>

                    <Grid container spacing={4} sx={{ mt: 2 }}>
                        {[
                            {
                                icon: <HikingIcon fontSize="large" />,
                                title: t("createOrFindTitle"),
                                description: t("createOrFindDesc")
                            },
                            {
                                icon: <PersonAddIcon fontSize="large" />,
                                title: t("applyTitle"),
                                description: t("applyDesc")
                            },
                            {
                                icon: <CommentIcon fontSize="large" />,
                                title: t("connectPlanTitle"),
                                description: t("connectPlanDesc")
                            },
                            {
                                icon: <ExploreIcon fontSize="large" />,
                                title: t("embarkTitle"),
                                description: t("embarkDesc")
                            }
                        ].map((item, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                <AnimateWrapper {...animationConfig.card(index)}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            textAlign: 'center',
                                            borderRadius: 2,
                                            transition: "transform 0.3s, box-shadow 0.3s",
                                            "&:hover": {
                                                transform: "translateY(-10px)",
                                                boxShadow: 3
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                width: 70,
                                                height: 70,
                                                bgcolor: 'primary.light',
                                                mx: 'auto',
                                                mb: 2
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </Paper>
                                </AnimateWrapper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Tours Section */}
            <Box id="explore-tours" sx={{ backgroundColor: "#f5f7fa", py: 6 }}>
                <Container maxWidth="xl">
                    <AnimateWrapper {...animationConfig.sectionTitle}>
                        <Typography
                            variant="h4"
                            sx={{
                                textAlign: 'center',
                                fontWeight: "bold",
                                mb: 1,
                                position: 'relative'
                            }}
                        >
                            {t('exploreGroupTours')}
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                textAlign: 'center',
                                mb: 5,
                                color: 'text.secondary',
                                maxWidth: '800px',
                                mx: 'auto'
                            }}
                        >
                            {t('exploreGroupToursPara')}
                        </Typography>
                    </AnimateWrapper>

                    <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <Box sx={{ display: "flex", gap: 2, p: 3, backgroundColor: '#ffffff' }}>
                            {!isMobile && (
                                <AnimateWrapper {...animationConfig.filterPanel}>
                                    <Box sx={{ width: "280px", flexShrink: 0 }}>
                                        <Divider sx={{ mb: 2 }} />
                                        <Filters filters={filters} setFilters={setFilters} />
                                    </Box>
                                </AnimateWrapper>
                            )}

                            <Box sx={{ flex: 1 }}>
                                {isMobile && (
                                    <Box 
                                    sx={{ 
                                        display: "flex", 
                                        justifyContent: "center", 
                                        mb: 3,
                                        top: '0',
                                        zIndex: 1,
                                        backgroundColor: "white",
                                        borderBottom: "1px solid #e0e0e0",
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        style={{ width: "100%" }}
                                    >
                                        <Badge 
                                            badgeContent={activeFiltersCount} 
                                            color="error"
                                            sx={{
                                                width: "100%",
                                                "& .MuiBadge-badge": {
                                                    right: -3,
                                                    top: 13,
                                                    border: `2px solid white`,
                                                    padding: '0 4px',
                                                }
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => setFiltersOpen(true)}
                                                sx={{
                                                    width: "100%",
                                                    maxHeight: "48px",
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    fontWeight: "600",
                                                    boxShadow: 2,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    padding: "10px 16px",
                                                }}
                                            >
                                                <FilterAltIcon sx={{ mr: 1 }} />
                                                {t('filterTours')}
                                            </Button>
                                        </Badge>
                                    </motion.div>
                                </Box>
                                )}

                                <Drawer
                                    anchor="left"
                                    open={filtersOpen}
                                    onClose={() => setFiltersOpen(false)}
                                >
                                    <Box sx={{ width: 300, padding: 2 }}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                marginBottom: "16px",
                                            }}
                                        >
                                            <Typography variant="h6">Filters</Typography>
                                            <IconButton onClick={() => setFiltersOpen(false)}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Box>
                                        <Filters filters={filters} setFilters={setFilters}  
                                         onActiveFiltersChange={setActiveFiltersCount}  />
                                    </Box>
                                </Drawer>

                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <Box
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                minHeight: "300px",
                                            }}
                                        >
                                            <AnimateWrapper key="loading" {...animationConfig.spinner}>
                                                <CircularProgress />
                                            </AnimateWrapper>
                                        </Box>
                                    ) : posts.length > 0 ? (
                                        <>
                                            <Grid container spacing={3}>
                                                <TripList posts={posts} />
                                            </Grid>

                                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                                <AnimateWrapper {...animationConfig.pagination}>
                                                    <Pagination
                                                        count={Math.ceil(count / 9)}
                                                        page={Number(filters.page)}
                                                        onChange={handlePageChange}
                                                        color="primary"
                                                    />
                                                </AnimateWrapper>
                                            </Box>
                                        </>
                                    ) : (
                                        <AnimateWrapper key="empty" {...animationConfig.emptyState}>
                                            <Box sx={{ textAlign: 'center', py: 6 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: "text.secondary",
                                                        mb: 2
                                                    }}
                                                >
                                                    {t("noToursFound")}
                                                </Typography>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{ display: 'inline-block', marginRight: '16px' }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => {
                                                            setFilters({
                                                            country_to: '',
                                                            city_to: '',
                                                            country_from: '',
                                                            city_from: '',
                                                            gender: "",
                                                            date_from: '',
                                                            date_to: '',
                                                            age_group: '',
                                                            group_size: '',
                                                            page: 1,
                                                        })
                                                        setActiveFiltersCount(0)
                                                        }}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            textTransform: "none",
                                                            fontWeight: 600,
                                                            mr: 2
                                                        }}
                                                    >
                                                        {t('resetFilters')}
                                                    </Button>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        onClick={() => {
                                                            profile?.profile ?
                                                                navigate('/add/post')
                                                                :
                                                                navigate('/register')
                                                        }}
                                                        sx={{
                                                            borderRadius: "8px",
                                                            textTransform: "none",
                                                            fontWeight: 600
                                                        }}
                                                    >
                                                        Create Your Own Tour
                                                    </Button>
                                                </motion.div>
                                            </Box>
                                        </AnimateWrapper>
                                    )}
                                </AnimatePresence>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </motion.div>
    );
};

export default HomePage;