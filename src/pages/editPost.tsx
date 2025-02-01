import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Container,
  Typography,
  Box,
  Grid,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { get_AllCountries, getCitiesByCId } from "../redux/slice/filterSlice";
import postServices from "../redux/api/postService";
import { get_AllPosts, get_post } from "../redux/slice/postsSlice";
import { useNavigate, useParams } from "react-router-dom";

import DeleteIcon from "@mui/icons-material/Delete";
import { addPostStyles } from "./styles";
import styled from "@emotion/styled";
import Navbar from "../components/navbar";

const CustomDetails = styled(TextField)({
  "& .MuiOutlinedInput-input": {
    padding: "0px !important",
  },
  "& .MuiInputBase-inputMultiline": {
    height: "auto !important", // Ensures your style is applied
    overflow: "visible !important", // Allows content to grow
  },
});

const initialValues = {
  title: "",
  country: "",
  city: "",
  postalCode: "",
  place: "",
  departureDate: "",
  returnDate: "",
  text: "",
  gender: "",
  images: [],
};
const EditPost = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCity, setOpenCity] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getCountries = useSelector((state) => state.filter);
  const cities = useSelector((s) => s.filter) || [];
  console.log("imageFiles", imageFiles);

  useEffect(() => {
    try {
      dispatch(get_AllCountries());
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validations({ [name]: value });
  };

  useEffect(() => {
    if (formData.country) {
      try {
        dispatch(getCitiesByCId(formData.country));
      } catch (err) {
        console.log(err);
      }
    }
  }, [formData.country]);

  const convertUrlsToFiles = async (urls) => {
    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    // const imageUrl =
    //   "https://zusammenreisen-media.s3.amazonaws.com/media/testuser%40gmail.com/152fd786a4dc3fd4e2b30769b80fe89e_kc2I7nc.jpg";

    const filePromises = urls.map(async (url) => {
      const response = await fetch(proxyUrl + url);
      const blob = await response.blob();
      const fileName = url.split("/").pop(); // Extract file name from the URL

      // Create a new File object
      return new File([blob], fileName, { type: blob.type });
    });

    return Promise.all(filePromises);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);
  const fetchData = async () => {
    try {
      const res = await postServices.getPost(id);

      if (res.status === 200) {
        setFormData({
          title: res?.data?.title || "",
          country: res?.data?.travel_to_country?.id || "",
          city: res?.data?.travel_to_city?.id || "",
          postalCode: res?.data?.travel_to_postal_code || "",
          place: res?.data?.title || "",
          departureDate: res?.data?.date_from || "",
          returnDate: res?.data?.date_to || "",
          text: res?.data?.text || "",
          gender: res?.data?.posted_by?.gender || "",
          images: res?.data?.images || [],
        });
        setPreviewImages(res?.data?.images || []);
        const images = res?.data?.images; // Assuming this is an array of URLs
        if (Array.isArray(images)) {
          const imageFiles = await convertUrlsToFiles(images);
          console.log(imageFiles); // Log the array of File objects
          setImageFiles(imageFiles); // Set the state with the File objects
        } else {
          console.error("Images data is not an array");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong cannot fetch data");
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFileArray = Array.from(files);
      const newPreviewArray = newFileArray.map((file) =>
        URL.createObjectURL(file)
      );

      // Add new images to state
      setPreviewImages((prev) => [...prev, ...newPreviewArray]);
      setImageFiles((prev) => [...prev, ...newFileArray]);
    }
  };

  const handleImageRemove = (index: number) => {
    setPreviewImages((prev) => {
      URL.revokeObjectURL(prev[index]); // Release memory
      return prev.filter((_, i) => i !== index);
    });

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOpenCountry = () => {
    setOpenCountry(true);
    (async () => {
      setLoading(true);

      setLoading(false);
    })();
  };

  const handleCloseCountry = () => {
    setOpenCountry(false);
  };
  const handleOpenCity = () => {
    setOpenCity(true);
    (async () => {
      setLoading(true);

      setLoading(false);
    })();
  };

  const handleCloseCity = () => {
    setOpenCity(false);
  };
  const validations = (fieldValue = formData) => {
    const temp: { [key: string]: string } = { ...errors };
    if ("title" in fieldValue)
      temp.title = fieldValue.title ? "" : "Title is required";
    if ("country" in fieldValue)
      temp.country = fieldValue.country ? "" : "Country is required";
    if ("city" in fieldValue)
      temp.city = fieldValue.city ? "" : "City is required";
    if ("departureDate" in fieldValue)
      temp.departureDate = fieldValue.departureDate
        ? ""
        : "Departure date is required";
    if ("returnDate" in fieldValue)
      temp.returnDate = fieldValue.returnDate ? "" : "Return date is required";
    if ("text" in fieldValue)
      temp.text = fieldValue.text ? "" : "This field is required";

    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const handleEditPost = async () => {
    if (validations()) {
      const postData = new FormData();
      postData.append("title", formData.title);
      postData.append("travel_to_country", formData.country);
      postData.append("travel_to_city", formData.city);
      //        formData.append("postalCode", formData.postalCode);
      //      formData.append("place", formData.place);
      postData.append("date_from", formData.departureDate);
      postData.append("date_to", formData.returnDate);
      postData.append("text", formData.text);
      postData.append("gender", formData.gender);

      // Append all images
      imageFiles.forEach((file) => {
        postData.append("images", file); // Same key for multiple files
      });
      const ID = parseInt(id);

      try {
        setIsLoading(true);
        const res = await postServices.editPost(ID, postData); // Assuming postServices.createPost handles FormData

        if (res.status === 200) {
          setIsLoading(false);
          toast.success("Post updated successfully");
          setFormData(initialValues);
          setPreviewImages([]);
          setImageFiles([]);
          navigate(-1);
          dispatch(get_AllPosts());
        }
      } catch (error) {
        console.error(error);
        toast.error(
          `${error?.response?.data?.errors[0]?.detail} (${error?.response?.data?.errors[0]?.attr})
                  `
        );
        setIsLoading(false);
      }
    }
  };
  const dummyImage = "https://via.placeholder.com/150?text=No+Image+Uploaded";

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
      <Container sx={{ padding: "5rem 0rem" }}>
        <Box>
          <Box sx={addPostStyles.header}>
            <Typography variant="h3">Edit Post</Typography>
            <Button variant="contained" onClick={() => navigate(-1)}>
              {" "}
              Back
            </Button>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                autoFocus
                label="Title"
                type="text"
                fullWidth
                variant="outlined"
                name="title"
                value={formData.title}
                helperText={errors.title}
                error={Boolean(errors.title)}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                sx={{ width: "100%" }}
                open={openCountry}
                onOpen={handleOpenCountry}
                onClose={handleCloseCountry}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                getOptionLabel={(option) => option?.name || ""}
                options={getCountries?.data || []}
                value={getCountries?.data?.find(
                  (item: any) => item.id === formData.country
                )}
                onChange={(event, newValue) => {
                  handleChange({
                    target: { name: "country", value: newValue?.id || "" },
                  });
                }}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    variant="outlined"
                    error={Boolean(errors.country)}
                    helperText={errors.country}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              {" "}
              <Autocomplete
                sx={{ width: "100%" }}
                open={openCity}
                onOpen={handleOpenCity}
                onClose={handleCloseCity}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                getOptionLabel={(option) => option.name || ""}
                options={Array.isArray(cities?.cities) ? cities.cities : []}
                value={
                  Array.isArray(cities?.cities)
                    ? cities.cities.find(
                        (item: any) => item.id === formData.city
                      ) || null
                    : null
                }
                onChange={(event, newValue) => {
                  handleChange({
                    target: { name: "city", value: newValue?.id || "" },
                  });
                }}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    variant="outlined"
                    error={Boolean(errors.city)}
                    helperText={errors.city}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              {" "}
              <TextField
                label="Postal Code"
                type="text"
                fullWidth
                variant="outlined"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Place"
                type="text"
                fullWidth
                variant="outlined"
                name="place"
                value={formData.place}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Departure Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                name="departureDate"
                value={formData.departureDate}
                helperText={errors.departureDate}
                error={Boolean(errors.departureDate)}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              {" "}
              <TextField
                label="Return Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                name="returnDate"
                value={formData.returnDate}
                helperText={errors.returnDate}
                error={Boolean(errors.returnDate)}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              {" "}
              <CustomDetails
                label="Tell us about your plans"
                fullWidth
                multiline
                variant="outlined"
                maxRows={4}
                rows={4}
                name="text"
                sx={{ height: "auto" }}
                value={formData.text}
                helperText={errors.text}
                error={Boolean(errors.text)}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              {" "}
              <TextField
                select
                label="Gender"
                fullWidth
                name="gender"
                helperText={errors?.gender}
                value={formData?.gender}
                error={Boolean(errors?.gender)}
                onChange={handleChange}
              >
                <MenuItem value="1">Male</MenuItem>
                <MenuItem value="0">Female</MenuItem>
                <MenuItem value="2">other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload Images
                <input
                  type="file"
                  multiple
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={addPostStyles.imageWrapper}>
                {previewImages?.length > 0 ? (
                  previewImages?.map((img, index) => (
                    <Box key={index} sx={addPostStyles.imageWrapper2}>
                      <img
                        src={img}
                        alt={`preview-${index}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <IconButton
                        onClick={() => handleImageRemove(index)}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          background: "rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <img
                    src={dummyImage}
                    alt="dummy"
                    style={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              {" "}
              <Button variant="contained" size="large" onClick={handleEditPost}>
                {isLoading ? "loading..." : "Edit Post"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default EditPost;
