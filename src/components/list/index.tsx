import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  Drawer,
  Pagination,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import postServices from "../../redux/api/postService";
import Filters from "../filters";
import { useSearchParams } from "react-router-dom";
import { FilterState } from "../../types";



const PostsList = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 960px)");
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams(); //params in FE url e.g list?to=123

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    country: searchParams.get("to") || "",
    city: '',
    gender: "",
    date_from : searchParams.get("date_from") || "",
    date_to : searchParams.get("date_to") || "",
  });

  // Compute URL params whenever filters or page changes
  const urlParams = new URLSearchParams({
    page: page.toString(),
    ...(filters.country && { country: filters.country }),
    ...(filters.city && { city: filters.city }),
    ...(filters.date_from && { date_from: filters.date_from }),
    ...(filters.date_to && { date_to: filters.date_to }),
    ...(filters.gender && { gender: String(filters.gender) }),
  }).toString();



  const fetchPosts = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await postServices.getAllPosts(urlParams);
      setPosts(response.data.results);
      setCount(response.data.count);
      setPage(pageNumber);
    } catch (error) {
        console.log(error)
      toast.error("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch posts whenever `urlParams` changes
  useEffect(() => {
    const fetchPosts = async () => {
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

    fetchPosts();
  }, [urlParams]); // Fetch whenever `urlParams` changes


  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchPosts(value);
  };


  return (
    <Box sx={{ padding: 2 }}>
      {/* Container for Filters and Posts */}
      <Box sx={{ display: "flex", gap: 2 }}>
        {/* Filters Section */}
        {!isMobile && (
          <Box sx={{ width: "250px", flexShrink: 0 }}>
            <Filters filters={filters} setFilters={setFilters} />
          </Box>
        )}
        
        {isMobile && (
          <>
            <IconButton
              onClick={() => setFiltersOpen(true)}
              sx={{ marginLeft: "7.5rem", position: "absolute", top: "0" }}
            >
              <FilterAltIcon fontSize="small" />
            </IconButton>
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
                <Filters setURLParams={setURLParams} pageNumber={page} />
                </Box>
            </Drawer>
          </>
        )}
  
        {/* Right Section (Header + Posts) */}
        <Box sx={{ flex: 1 }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              User Posts
            </Typography>
            <Button variant="contained" onClick={() => navigate("/add/post")}>
              Add Post
            </Button>
          </Box>
  
          {/* Posts List */}
          {loading ? (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : posts.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {posts.map((item, index) => (
                  <Grid item key={index} xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "10px",
                            overflow: "hidden",
                            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${item?.posted_by?.picture})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <Box
                          sx={{
                            textAlign: "left",
                            marginTop: 2,
                            paddingLeft: "12px",
                          }}
                        >
                          <Typography variant="h6">
                            {item?.posted_by?.user?.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "12px" }}>
                            {new Date(item?.posted_on).toLocaleDateString()}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "13px", fontWeight: "bold" }}
                          >
                            {item.travel_to_city}, {item.travel_to_country}
                          </Typography>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "260px",
                            }}
                          >
                            {item?.text}
                          </Typography>
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
                          >
                            See Details
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
  
              {/* Pagination */}
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
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{
                margin: "auto",
                marginTop: 4,
                textAlign: "center",
                color: "#666",
              }}
            >
              No posts found matching the filters.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
  
};

export default PostsList;
