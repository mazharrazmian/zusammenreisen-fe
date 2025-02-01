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
import { get_AllPosts } from "../../redux/slice/postsSlice";
import { listStyles } from "../../pages/styles";
import image1 from "../../assets/2.jpg";
import Iconify from "../iconify";

const UserPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 960px)");

  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refetch, setRefetch] = useState(false); // For toggling filters
  const postsPerPage = 6;
  const [filters, setFilters] = React.useState<FilterState>({
    country: "",
    city: "",
    postalCode: "",
    gender: "",
  });


  const Posts = useSelector((state) => state.posts);
  const profile = useSelector((s) => s?.profile);

  // console.log("profile", profile);
  useEffect(() => {
    dispatch(get_AllCountries());
    dispatch(get_AllPosts());
  }, [refetch]);
  
  const filteredPosts = Posts?.data?.filter((post) => {
    const { country, city, postalCode, gender } = filters;

    if (country && post.country !== country) return false;
    if (gender && post.gender !== gender) return false;
    if (city && post?.city !== city) return false;
    if (postalCode && post?.postalCode !== postalCode) return false;

    return true;
  });

  const startIndex = (page - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Box sx={listStyles.userPostsWrapper}>
        {!isMobile && (
          <Filters onFilterChange={handleFilterChange} data={Posts} />
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
              {/* <Grid container spacing={2} sx={{ padding: 2 }}>
            {currentPosts?.length > 0 ? (
              currentPosts?.map((item: any, index) => (
                <Grid item key={index} xs={12} md={4}>
                  <Card
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      "&:hover .overlay": {
                        transform: "translateY(0)", // Show overlay on hover
                      },
                      "&:hover .bgImage": {
                        transform: "scale(1.1)", // Zoom background on hover
                      },
                      "& .MuiCardContent-root:last-child": {
                        paddingBottom: "0px",
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        padding: 0,
                        height: "300px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                   
                      <Box
                        className="bgImage"
                        sx={{
                          width: "100%",
                          height: "100%",
                          backgroundImage: `url(${image1})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          transition: "transform 0.3s ease-in-out",
                        }}
                      />
                    
                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(0, 0, 0, 0.3)",
                          color: "white",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-evenly",
                          padding: 2,
                          
                          transition: "transform 0.4s ease-in-out",
                          overflowY: "auto",
                        }}
                      >
                        <Box
                          className="overlay"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            justifyContent: "space-between",
                            display: "flex",
                            flexDirection: "column",
                            padding: 2,
                          }}
                        >
                          
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1,
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

                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                color: "#fff",
                              }}
                              onClick={() => navigate(`/details/${item?.id}`)}
                            >
                              See Details
                            </Button>
                          </Box>
                         
                          <Box
                            sx={{
                              textAlign: "left",
                              marginTop: 2,
                              display: "flex",
                              gap: "10px",
                              justifyContent: "start",
                            }}
                          >
                            <Avatar
                              alt={item?.posted_by?.user?.name}
                              src={item?.posted_by?.picture}
                              sx={{
                                width: 40,
                                height: 40,
                              }}
                            />
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
                              <Typography variant="body2">
                                {new Date(item?.posted_on).toLocaleDateString()}
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
          </Grid> */}
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

                              {/* <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              color: "#fff",
                              minWidth: "40px",
                            }}
                          >
                            <Iconify icon="lucide:move-right" />
                          </Button> */}
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
              {/* <Grid container spacing={2} sx={{ padding: 2 }}>
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
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "6%",
                            left: "3%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            {" "}
                            <Avatar
                              alt={item?.posted_by?.user?.name}
                              src={item?.posted_by?.picture}
                              sx={{
                                width: 40,
                                height: 40,
                              }}
                            />
                            <Typography variant="body1" color="#fff">
                              {item?.posted_by?.user?.name}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `
    linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
    url(${image1})
  `,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        
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
                              onClick={() => navigate(`/edit/post/${item.id}`)}
                            >
                              <Iconify icon="cuida:edit-outline" />
                            </Button>
                          )}

                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              color: "#fff",
                              minWidth: "40px",
                            }}
                            onClick={() => navigate(`/details/${item?.id}`)}
                          >
                            <Iconify icon="lucide:move-right" />
                          </Button>
                        </Box>
                      </Box>

                      <Box>
                        <Box
                          sx={{
                            textAlign: "left",
                            marginTop: 2,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: "12px" }}>
                            {new Date(item?.posted_on).toLocaleDateString()}
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
          </Grid> */}
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
