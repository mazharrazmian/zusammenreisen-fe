import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Box,
  Button,
  Pagination,
  IconButton,
  Drawer,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { FilterState } from "../../types";
import Filters from "../filters";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_AllCountries } from "../../redux/slice/filterSlice";

import { listStyles } from "../../pages/styles";
import image1 from "../../assets/2.jpg";
import Iconify from "../iconify";
import postServices from "../../redux/api/postService";

const UserPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 960px)");
  const [posts, setPosts] = useState<PostType[]>([]);
  const [count, setCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  // Filtering state
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    date_from: "",
    date_to: "",
  });
  
  const fetchPosts = async (pageNumber = 1) => {
    try {
      // Construct query parameters for filtering
      const params = new URLSearchParams({
        page: pageNumber.toString(),
        ...(filters.country && { country: filters.country }),
        ...(filters.city && { city: filters.city }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
      }).toString();
  
      const response = await postServices.getAllPosts(params);
      setPosts(response.data.results);
      setCount(response.data.count);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
      setPage(pageNumber);
    } catch (error) {
      toast.error("Failed to fetch posts.");
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, [filters]); // Fetch posts when filters change
  
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    fetchPosts(value);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  

  return (
    <>
      <Box sx={listStyles.userPostsWrapper}>
        {!isMobile && (
          <Filters onFilterChange={handleFilterChange} data={posts} />
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
                <Filters data={Posts} onFilterChange={handleFilterChange} />
              </Box>
            </Drawer>
          </>
        )}

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                marginLeft: "20px",
                fontWeight: "bold",
              }}
            >
              User Posts
            </Typography>
            <Button variant="contained" onClick={() => navigate("/add/post")}>
              Add Post
            </Button>
          </Box>

          {Posts.loading === "fulfilled" ? (
            <>
              {" "}
             
              <Grid container spacing={2} sx={{ padding: 2 }}>
                {currentPosts?.length > 0 ? (
                  currentPosts?.map((item: any, index) => (
                    <Grid item key={index} xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              width: "100%",
                              height: "200px",
                              borderRadius: "10px",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: `
    linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${item?.posted_by?.picture})
  `,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            {/* Buttons */}

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                gap: "10px",
                                position: "absolute",
                                top: "6%",
                                right: "6%",
                              }}
                            >
                              {profile?.profile?.profile?.id ===
                                item?.posted_by?.id && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  sx={{
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    minWidth: "40px",
                                    color: "#fff",
                                  }}
                                  onClick={() =>
                                    navigate(`/edit/post/${item.id}`)
                                  }
                                >
                                  <Iconify icon="cuida:edit-outline" />
                                </Button>
                              )}

                             
                            </Box>
                          </Box>

                          <Box>
                            <Box
                              sx={{
                                textAlign: "left",
                                marginTop: 2,
                                display: "flex",
                                gap: "10px",
                                justifyContent: "start",
                                paddingLeft: "12px",
                              }}
                            >
                              {/* <Avatar
                            alt={item?.posted_by?.user?.name}
                            src={item?.posted_by?.picture}
                            sx={{
                              width: 50,
                              height: 50,
                            }}
                          /> */}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography variant="h6">
                                  {item?.posted_by?.user?.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontSize: "12px" }}
                                >
                                  {new Date(
                                    item?.posted_on
                                  ).toLocaleDateString()}
                                </Typography>
                                <Typography
                                  sx={{ fontSize: "13px", fontWeight: "bold" }}
                                >
                                  {item.travel_to_city}
                                  {", "}
                                  {item.travel_to_country}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  noWrap
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    width: "260px",
                                  }}
                                >
                                  {item?.text}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                              }}
                              mt={2}
                            >
                              <Button
                                onClick={() => navigate(`/details/${item?.id}`)}
                                variant="contained"
                                fullWidth
                              >
                                See Details
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
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
              </Grid>
              
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 3,
                }}
              >
                <Pagination
                  count={Math.ceil(filteredPosts.length / postsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          ) : (
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
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserPosts;
