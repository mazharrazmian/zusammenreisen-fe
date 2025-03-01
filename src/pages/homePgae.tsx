import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Rating, Typography, CircularProgress, Drawer, IconButton, Pagination, Chip, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SearchComponent from "../components/search";
import { get_AllCountries } from "../redux/slice/filterSlice";
import { homePageStyles } from "./styles";
import postServices from "../redux/api/postService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import AnimatedText from "../components/animateText/animateText";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import Filters from "../components/filters";
import { FilterState } from "../types";
import GenderIcon from "../Constants";
import { toast } from "react-toastify";

const HomePage: React.FC = () => {
  const places = useAppSelector(s => s.filter.countries);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 960px)");
  
  // Featured destinations state
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  
  // Posts list state
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

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
  });

  // Save filters whenever they change
  useEffect(() => {
    sessionStorage.setItem("postsFilters", JSON.stringify(filters));
  }, [filters]);

  const urlParams = new URLSearchParams({
    page: page.toString(),
    ...(filters.country_to && { country_to: filters.country_to }),
    ...(filters.city_to && { city_to: filters.city_to }),
    ...(filters.date_from && { date_from: filters.date_from }),
    ...(filters.date_to && { date_to: filters.date_to }),
    ...(filters.gender && { gender: String(filters.gender) }),
  }).toString();

  const fetchPosts = async (pageNumber = 1) => {
    setSearchParams(urlParams);
    setLoading(true);
    try {
      const response = await postServices.getAllPosts(urlParams);
      setPosts(response.data.results);
      setCount(response.data.count);
      setPage(pageNumber);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured destinations
  useEffect(() => {
    postServices.getFeaturedDestinations()
      .then(response => {
        setFeaturedDestinations(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Fetch posts when filters or page changes
  useEffect(() => {
    fetchPosts();
  }, [urlParams]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchPosts(value);
  };

  const memoizedAnimatedText = useMemo(() => <AnimatedText />, []);

  return (
    <>
      {/* Hero section with background and animated text */}
      <Box sx={homePageStyles.mainWrapper}>
        {memoizedAnimatedText}
      </Box>
      
      {/* Search component */}
      <SearchComponent places={places} />
      
      {/* Travel Partners Section (Integrated PostsList) */}
      <Box sx={{ backgroundColor: "#f0f2f5", padding: 3, marginTop: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", marginBottom: "30px", textAlign: 'center' }}>
            Find Travel Partners
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            {!isMobile && (
              <Box sx={{ width: "250px", flexShrink: 0 }}>
                <Filters filters={filters} setFilters={setFilters} />
              </Box>
            )}

            <Box sx={{ flex: 1 }}>
              {isMobile && (
                <>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setFiltersOpen(true)}
                      sx={{
                        width: "90%",
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
                      Filters
                    </Button>
                  </Box>

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
                </>
              )}

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
                <>
                  <Grid container spacing={3}>
                    {posts.map((item, index) => (
                      <Grid key={index} xs={12} sm={6} md={4}>
                        <Card
                          sx={{
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                            },
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardContent sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                width: "100%",
                                height: "200px",
                                borderRadius: "8px",
                                overflow: "hidden",
                                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${item?.posted_by?.picture})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <Box
                              sx={{
                                textAlign: { xs: 'center', sm: 'left' },
                                marginTop: 2,
                                paddingLeft: "12px",
                              }}
                            >
                              <Typography variant="h6" sx={{ fontWeight: "600" }}>
                                {`${item?.posted_by?.user?.name}  ${item?.posted_by?.age || ''}`}
                                <GenderIcon gender={item?.posted_by?.gender}></GenderIcon>
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ marginTop: '2px', fontSize: "12px", color: "text.secondary" }}
                              >
                                From {new Date(item.date_from).toLocaleDateString()} - To{" "}
                                {new Date(item.date_to).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                <strong>From:</strong> {item.travel_from_city},{" "}
                                {item.travel_from_country}
                              </Typography>
                              <Typography variant="body2">
                                <strong>To:</strong> {item.travel_to_city},{" "}
                                {item.travel_to_country}
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ marginTop: '1em', justifyContent: { xs: 'center', sm: 'left' } }}>
                                {item?.travelling_alone ? (
                                  <Chip
                                    label={'Travelling Alone'}
                                    size="small"
                                  />
                                ) : (
                                  <Chip
                                    label={'Travelling In Group'}
                                    size="small"
                                  />
                                )}
                                
                                {item.dates_flexible && (
                                  <Chip
                                    label={`Dates Flexible`}
                                    size='small'
                                  />
                                )}
                              </Stack>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                                marginTop: 2,
                              }}
                            >
                              <Button
                                onClick={() => navigate(`/details/${item?.id}`)}
                                variant="contained"
                                fullWidth
                                sx={{
                                  borderRadius: "8px",
                                  textTransform: "none",
                                  fontWeight: "600",
                                }}
                              >
                                See Details
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: 3,
                    }}
                  >
                    <Pagination
                      count={Math.ceil(count / 15)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                  
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => navigate("/list")}
                      sx={{ 
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: "600",
                        padding: "10px 24px"
                      }}
                    >
                      See All Travel Partners
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  variant="h6"
                  sx={{
                    margin: "auto",
                    marginTop: 4,
                    textAlign: "center",
                    color: "text.secondary",
                    marginBottom: 4
                  }}
                >
                  No travel partners found matching your filters.
                </Typography>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Featured Destinations Section */}
      <Box sx={{ backgroundColor: "#f8f9fa", padding: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", marginBottom: "30px", textAlign: 'center' }}>
            Featured Healing Destinations
          </Typography>
          <Grid container spacing={4}
            sx={{ display: "flex", justifyContent: 'center', alignContent: 'space-between' }}
          >
            {featuredDestinations.map((destination) => (
              <Grid xs={12} sm={6} md={4} key={destination.id}>
                <Card sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image}
                    alt={destination.country.name}
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1, width: 300 }}>
                      <Typography variant="h6" component="h2">
                        {destination.city.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Rating value={destination.ratings} precision={0.5} readOnly size="small" />
                        <Typography variant="body2">{destination.ratings.toFixed(1)}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {destination.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: 2 }}
                      onClick={() => navigate(`/list?city_to=${destination.city.id}&country_to=${destination.country.id}`)}
                    >
                      Find Travellers
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;