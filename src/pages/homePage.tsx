import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Typography, CircularProgress, Drawer, IconButton, Pagination, Chip, Stack, useMediaQuery, Paper, Avatar, Divider } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { homePageStyles } from "./styles";
//import tourServices from "../redux/api/tourService";
import { useNavigate, useSearchParams } from "react-router-dom";
import AnimatedText from "../components/animateText/animateText";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
//import TourFilters from "../components/tourFilters";
import { FilterState } from "../types";
import { toast } from "react-toastify";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExploreIcon from "@mui/icons-material/Explore";
import GroupIcon from "@mui/icons-material/Group";
import HikingIcon from "@mui/icons-material/Hiking";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CommentIcon from "@mui/icons-material/Comment";
import Filters from "../components/filters";
import postServices from "../redux/api/postService";
import { useAppSelector } from "../redux/store";

const HomePage: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 960px)");
  const profile = useAppSelector((s) => s.profile);

  // Tours list state
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

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
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };
  // Fetch tours when filters or page changes
  useEffect(() => {
    fetchPosts();
  }, [urlParams]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      page: value,
    }));
  };

  
//    const memoizedAnimatedText = useMemo(() => <AnimatedText />, []);


  return (
    <>
      {/* Hero section with background and animated text */}
      <Box sx={homePageStyles.mainWrapper}>

    <Typography variant="h3" sx={{textAlign:'center',marginBottom:2}}>
    Where Solo Travelers Become Travel Mates.
    </Typography>        
        <Box sx={{
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: "center",
  justifyContent: "center",
  gap: 2
}}>
  <Button 
    variant="contained" 
    color="primary" 
    onClick={() => document.getElementById('explore-tours').scrollIntoView({behavior: 'smooth'})} 
    sx={{ 
      borderRadius: "30px", 
      textTransform: "none", 
      fontWeight: "600", 
      fontSize: { xs: "0.9rem", sm: "1.1rem" }, 
      padding: { xs: "10px 25px", sm: "12px 30px" }, 
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", 
      backgroundColor: "primary.main",
      width: { xs: "100%", sm: "220px" },
      "&:hover": { 
        backgroundColor: "primary.dark", 
        transform: "translateY(-3px)", 
        boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)" 
      }, 
      transition: "all 0.3s ease" 
    }} 
  > 
    Explore Tours 
  </Button> 
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
      borderRadius: "30px", 
      textTransform: "none", 
      fontWeight: "600", 
      fontSize: { xs: "0.9rem", sm: "1.1rem" }, 
      padding: { xs: "10px 25px", sm: "12px 30px" }, 
      borderColor: "white", 
      color: "white", 
      backgroundColor: "rgba(255, 255, 255, 0.1)", 
      width: { xs: "100%", sm: "220px" },
      "&:hover": { 
        backgroundColor: "rgba(255, 255, 255, 0.2)", 
        borderColor: "white", 
        transform: "translateY(-3px)", 
        boxShadow: "0 12px 20px rgba(0, 0, 0, 0.2)" 
      }, 
      transition: "all 0.3s ease" 
    }} 
  > 
    Create Your Tour 
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
            How Zusammenreisen Tours Works
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid size={{xs:12, sm:6, md:3}}>
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
                  <HikingIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Create or Find Tours
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create your own tour or browse existing tours based on activities, destinations, and dates that interest you.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12, sm:6, md:3}}>
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
                  <PersonAddIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Apply to Join
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find a tour you like? Submit an application to the tour manager explaining why you'd be a great addition to the group.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12, sm:6, md:3}}>
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
                  <CommentIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Connect & Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Once accepted, access the tour group chat to discuss details, coordinate logistics, and get to know your travel companions.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid size={{xs:12, sm:6, md:3}}>
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
                  Embark Together
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience amazing adventures with like-minded travelers, share costs, and create unforgettable memories.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Tours Section */}
      <Box id="explore-tours" sx={{ backgroundColor: "#f5f7fa", py: 6 }}>
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
            Explore Group Tours
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
            Discover exciting tours organized by fellow travelers, join a group that matches your interests, or create your own tour.
          </Typography>
          
          <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Box sx={{ display: "flex", gap: 2, p: 3, backgroundColor: '#ffffff' }}>
              {!isMobile && (
                <Box sx={{ width: "280px", flexShrink: 0 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Filters</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Filters filters={filters} setFilters={setFilters}  />
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
                      Filter Tours
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
                  <Box>
                    <Grid container spacing={3}>
                      {posts.map(tour => (
                        <Grid key={tour.id} size={{xs: 12, sm: 6, lg: 4}}>
                          <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                            },
                            borderRadius: '12px',
                            overflow: 'hidden'
                          }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={tour.image}
                              alt={tour.title}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                  {tour.title}
                                </Typography>
                                <Chip 
                                  label={tour.tour_type} 
                                  size="small" 
                                  color="primary" 
                                  sx={{ fontWeight: 500 }} 
                                />
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Typography color="text.primary" variant="body2" paddingRight={1}>
                                    From : 
                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                  {tour.travel_from_city}, {tour.travel_from_country}
                                </Typography>
                                
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography color="text.primary" variant="body2" paddingRight={1}>
                                    To : 
                                </Typography>
                                               
                                <Typography variant="body2" color="text.secondary">
                                  {tour.travel_to_city}, {tour.travel_to_country}
                                </Typography>
                                
                              </Box>
                              
                              

                              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(tour.date_from).toLocaleDateString('en-UK', { month: 'short', day: 'numeric' })}
                                  </Typography>
                                  
                                </Box>
                                -
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {new Date(tour.date_to).toLocaleDateString('en-UK', { month: 'short', day: 'numeric' })}
                                  </Typography>
                                  
                                </Box>
                              </Box>
                              
                              <Typography variant="body2" color="text.primary" sx={{ mb: 2, height: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {tour.description}
                              </Typography>
                              
                              <Divider sx={{ my: 2 }} />
                              
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar src={tour.posted_by.picture} sx={{ width: 24, height: 24, mr: 1 }} />
                                  <Typography variant="body2" fontWeight={500}>
                                    {tour.posted_by.user.name}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <GroupIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {tour.current_travellers}/{tour.group_size}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                              <Button 
                                variant="contained" 
                                fullWidth
                                sx={{
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: 600
                                }}
                                onClick={() => navigate(`posts/${tour.id}`)}
                              >
                                View Details
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination 
                        count={Math.ceil(count / 9)} 
                        page={Number(filters.page)} 
                        onChange={handlePageChange}
                        color="primary" 
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "text.secondary",
                        mb: 2
                      }}
                    >
                      No tours found matching your filters.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => setFilters({
                        country_to: '',
                        city_to: '',
                        country_from: '',
                        city_from: '',
                        gender: "",
                        date_from: '',
                        date_to: '',
                        age_group : 'any',
                        group_size : '',
                        page: 1,
                    })}
                      sx={{ 
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 600,
                        mr: 2
                      }}
                    >
                      Clear Filters
                    </Button>
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