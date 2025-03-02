import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Rating, Typography, CircularProgress, Drawer, IconButton, Pagination, Chip, Stack, useMediaQuery, Paper, Tabs, Tab, Divider, Avatar } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { homePageStyles } from "./styles";
import postServices from "../redux/api/postService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import AnimatedText from "../components/animateText/animateText";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import Filters from "../components/filters";
import { FilterState } from "../types";
import GenderIcon from "../Constants";
import { toast } from "react-toastify";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import PostsList from "../components/list";

const HomePage: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 960px)");
  
  // Featured destinations state
//   const [featuredDestinations, setFeaturedDestinations] = useState([]);
  
  // Posts list state
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  
  // Get saved filters from session storage
  const getSavedFilters = () => {
    const savedFilters = sessionStorage.getItem("postsFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  };

  const [filters, setFilters] = useState<FilterState>({
    country_to: searchParams.get("country_to") || getSavedFilters().country_to || "",
    city_to: searchParams.get("city_to") || getSavedFilters().city_to || "",
    gender: searchParams.get("gender") || getSavedFilters().gender || "",
    date_from: searchParams.get("date_from") || getSavedFilters().date_from || "",
    date_to: searchParams.get("date_to") || getSavedFilters().date_to || "",
    page : searchParams.get('page') || getSavedFilters().page || 1,
    country_from: searchParams.get("country_from") || getSavedFilters().country_from || "",
    city_from: searchParams.get("city_from") || getSavedFilters().city_from || "",
  });

  // Save filters whenever they change
  useEffect(() => {
    sessionStorage.setItem("postsFilters", JSON.stringify(filters));
  }, [filters]);

  const urlParams = new URLSearchParams({
    ...(filters.page && {page : String(filters.page)}),
    ...(filters.country_to && { country_to: filters.country_to }),
    ...(filters.city_to && { city_to: filters.city_to }),
    ...(filters.country_from && { country_from: filters.country_from }),
    ...(filters.city_from && { city_from: filters.city_from }),
    ...(filters.date_from && { date_from: filters.date_from }),
    ...(filters.date_to && { date_to: filters.date_to }),
    ...(filters.gender && { gender: String(filters.gender) }),

  }).toString();

  const fetchPosts = async () => {
    setSearchParams(urlParams);
    setLoading(true);
    try {
      const response = await postServices.getAllPosts(urlParams);
      setPosts(response.data.results);
      setCount(response.data.count);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured destinations
//   useEffect(() => {
//     postServices.getFeaturedDestinations()
//       .then(response => {
//         setFeaturedDestinations(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

  // Fetch posts when filters or page changes
  useEffect(() => {
    fetchPosts();
  }, [urlParams]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prevFilters => ({
        ...prevFilters,
        page: value,
    }));
};

//   const handleTabChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
//     setActiveTab(newValue);
//   };

  const memoizedAnimatedText = useMemo(() => <AnimatedText />, []);

  return (
    <>
      {/* Hero section with background and animated text */}
      <Box sx={homePageStyles.mainWrapper}>
        {memoizedAnimatedText}
        <Box 
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => document.getElementById('travel-partners').scrollIntoView({behavior: 'smooth'})}
            sx={{
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: "600",
              fontSize: "1.1rem",
              padding: "12px 30px",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              backgroundColor: "primary.main",
              
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "translateY(-3px)",
                boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)"
              },
              transition: "all 0.3s ease"
            }}
          >
            Find Travel Mates Now
          </Button>
        </Box>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 6, backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
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
            How Zusammenreisen Works
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{xs:12,sm:6,md:3}}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: "transform 0.3s",
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
                  <LocationOnIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Choose a Destination
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Select from our list of destinations or find a travel partner for your own dream location.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12,sm:6,md:3}}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: "transform 0.3s",
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
                  <CalendarTodayIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Set Your Dates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose when you want to travel and find others with matching schedules or flexible dates.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12,sm:6,md:3}}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: "transform 0.3s",
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
                  <GroupIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Find Mates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse profiles of like-minded travelers and connect with perfect travel companions.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12,sm:6,md:3}}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  textAlign: 'center',
                  borderRadius: 2,
                  transition: "transform 0.3s",
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
                  <ExploreIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Travel Together
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share adventures, cut costs, and make memories with your new travel companions.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Travel Partners Section (Integrated PostsList) */}
      <Box id="travel-partners" sx={{ backgroundColor: "#f5f7fa", py: 6 }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h4" 
            sx={{ 
              textAlign: 'center', 
              fontWeight: "bold", 
              mb: 1,
              position: 'relative'
            }}
          >
            Find Your Perfect Travel Mate
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
            Browse through our community of travelers looking for companions to share adventures and split costs.
          </Typography>
          
          <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ display: "flex", gap: 2, p: 3, backgroundColor: '#ffffff' }}>
              {!isMobile && (
                <Box sx={{ width: "280px", flexShrink: 0 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Filters</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Filters filters={filters} setFilters={setFilters} />
                </Box>
              )}

              <Box sx={{ flex: 1 }}>
                {isMobile && (
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
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
                      Refine Your Search
                    </Button>
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
                    <Filters filters={filters} setFilters={setFilters} />
                  </Box>
                </Drawer>

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
                    <CircularProgress />
                  </Box>
                ) : posts.length > 0 ? (
       
                    <PostsList posts={posts} page={Number(filters.page)} handlePageChange={handlePageChange} count={count}/>    
                
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        mb: 2
                      }}
                    >
                      No travel partners found matching your filters.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setFilters({
                        country_to: "",
                        city_to: "",
                        gender: "",
                        date_from: "",
                        date_to: "",
                        page : 1,
                      })}
                      sx={{ 
                        borderRadius: "8px",
                        textTransform: "none"
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>

    </>
  );
};

export default HomePage;