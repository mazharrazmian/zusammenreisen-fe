import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Button,
  IconButton,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get_post } from "../redux/slice/postsSlice";
import Navbar from "../components/navbar";
import { get_AllCountries, getCitiesByCId } from "../redux/slice/filterSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import image1 from "../assets/1.jpg";
import image2 from "../assets/listBg.jpg";
import image3 from "../assets/signUp.jpg";

import {
  Autoplay,
  EffectCreative,
  Navigation,
  Pagination,
} from "swiper/modules";
const dummyImages = [image1, image2, image3];
const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postData = useSelector((s) => s?.posts);
  const tempimages = postData?.post?.images;
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const images = dummyImages;
  console.log(postData);

  useEffect(() => {
    dispatch(get_post(id));
  }, [id, dispatch]);

  return (
    <>
      <Box
        sx={{
          background: "#000",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          zIndex: "3",
          height: "100px",
        }}
      >
        <Navbar position="fixed" />
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          margin: "auto",
          marginTop: "6rem",
          marginBottom: "3rem",
          padding: 3,
          borderRadius: "16px",
        }}
      >
        <Card
          sx={{
            padding: { xs: 1, md: 3 },
            borderRadius: "16px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          {postData?.loading === "fulfilled" ? (
            <CardContent>
              <Grid container spacing={{ md: 4, xs: 2 }}>
                {/* Details Section */}
                <Grid item xs={12} md={7}>
                  <Swiper
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    autoplay={{
                      delay: 3000, // Delay in milliseconds
                      disableOnInteraction: false, // Prevent autoplay from stopping on interaction
                    }}
                    effect={"creative"}
                    creativeEffect={{
                      prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                      },
                      next: {
                        translate: ["100%", 0, 0],
                      },
                    }}
                    modules={[Autoplay, Navigation, Pagination, EffectCreative]}
                    style={{ borderRadius: "16px", overflow: "hidden" }}
                  >
                    {tempimages?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <Box
                          component="img"
                          src={item}
                          alt={`Post image ${index + 1}`}
                          sx={{
                            width: "100%",
                            height: { xs: "300px", md: "500px" },
                            objectFit: "cover",
                            borderRadius: "16px",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => navigate(-1)}
                      sx={{
                        fontWeight: "bold",
                        display: { xs: "none", md: "flex" },
                      }}
                    >
                      Back
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{}}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <Avatar
                          alt={postData?.post?.posted_by?.user?.name}
                          src={postData?.post?.posted_by?.picture}
                          sx={{
                            width: 80,
                            height: 80,
                          }}
                        />
                        <Typography variant="h5">
                          {postData?.post?.posted_by?.user?.name}
                        </Typography>
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Travelling From
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "12px" }}
                              >
                                {postData?.post?.travel_to_city?.name},{" "}
                                {postData?.post?.travel_to_country?.name}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Travelling To
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "12px" }}
                              >
                                {postData?.post?.travel_to_city?.name},{" "}
                                {postData?.post?.travel_to_country?.name}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Date From
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {postData?.post?.date_from}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Date To
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {postData?.post?.date_to}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Age
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {" "}
                                {postData?.post?.age || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "12px" }}>
                              Gender
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {postData?.post?.gender || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Last visible logged in
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                sx={{ fontSize: "12px" }}
                                variant="body1"
                              >
                                {postData?.post?.gender || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Date
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "12px" }}
                              >
                                {new Date(
                                  postData?.post?.posted_on
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <Typography sx={{ fontSize: "10px" }}>
                              Languages
                            </Typography>
                            <Box
                              sx={{
                                border: "1px solid #eee",
                                borderRadius: "12px",
                                padding: "10px 17px",
                                background: "#ededed",
                                color: "#000",
                                width: "100%",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontSize: "12px" }}
                              >
                                {postData?.post?.languages || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h3">About Me</Typography>
                  <div
                    style={{
                      maxHeight: isExpanded ? "none" : "300px",
                      overflowY: "auto",
                    }}
                  >
                    <Typography variant="body1">
                      {postData?.post?.text}
                    </Typography>
                  </div>
                  {!isExpanded && (
                    <a
                      onClick={toggleExpand}
                      style={{
                        color: "#1877F2",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Read More
                    </a>
                  )}
                  {isExpanded && (
                    <a
                      onClick={toggleExpand}
                      style={{
                        color: "#1877F2",
                        fontSize: "14px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Show Less
                    </a>
                  )}
                </Grid>
              </Grid>
            </CardContent>
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
        </Card>
      </Box>
    </>
  );
};

export default Details;
