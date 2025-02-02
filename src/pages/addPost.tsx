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
import { get_AllPosts } from "../redux/slice/postsSlice";
import { useNavigate } from "react-router-dom";

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
    travel_from_country: "",
    travel_from_city: "",
    travel_to_country: "",
    travel_to_city: "",
    postalCode: "",
    departureDate: "",
    returnDate: "",
    text: "",
    gender: "",
    images: [],
    dates_flexible: false,
};
const AddPost = () => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewImages, setPreviewImages] = React.useState<string[]>([]);
    const [imageFiles, setImageFiles] = React.useState<File[]>([]);
    const [openToCountry, setOpenToCountry] = React.useState(false);
    const [openToCity, setOpenToCity] = React.useState(false);
    const [openFromCountry, setOpenFromCountry] = React.useState(false);
    const [openFromCity, setOpenFromCity] = React.useState(false);

    const [cities_to, setCitiesTo] = React.useState<Array<object>>([])
    const [cities_from, setCitiesFrom] = React.useState<Array<object>>([])

    const [loading, setLoading] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const getCountries = useSelector((state) => state.filter);


    useEffect(() => {
        dispatch(get_AllCountries());
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        validations({ [name]: value });
    };

    useEffect(() => {
        if (formData.travel_from_country) {

            postServices.filterCityByCountryId(formData.travel_from_country)
                .then(res => {
                    setCitiesFrom(res.data)
                })
                .catch(error => {
                    console.log(error)
                })

        }
    }, [formData.travel_from_country, dispatch]);

    useEffect(() => {
        if (formData.travel_to_country) {
            postServices.filterCityByCountryId(formData.travel_to_country)
                .then(res => {
                    setCitiesTo(res.data)
                })
                .catch(error => {
                    console.log(error)
                })

        }
    }, [formData.travel_to_country, dispatch]);

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
    const handleOpenToCountry = () => {
        setOpenToCountry(true);
        (async () => {
            setLoading(true);

            setLoading(false);
        })();
    };

    const handleCloseToCountry = () => {
        setOpenToCountry(false);
    };
    const handleOpenToCity = () => {
        setOpenToCity(true);
        (async () => {
            setLoading(true);

            setLoading(false);
        })();
    };

    const handleCloseToCity = () => {
        setOpenToCity(false);
    };


    const handleOpenFromCountry = () => {
        setOpenFromCountry(true);
        (async () => {
            setLoading(true);

            setLoading(false);
        })();
    };

    const handleCloseFromCountry = () => {
        setOpenFromCountry(false);
    };
    const handleOpenFromCity = () => {
        setOpenFromCity(true);
        (async () => {
            setLoading(true);

            setLoading(false);
        })();
    };

    const handleCloseFromCity = () => {
        setOpenFromCity(false);
    };


    const validations = (fieldValue = formData) => {
        const temp: { [key: string]: string } = { ...errors };
        if ("title" in fieldValue)
            temp.title = fieldValue.title ? "" : "Title is required";

        if ("travel_to_country" in fieldValue)
            temp.travel_to_country = fieldValue.travel_to_country ? "" : "Country is required";
        if ("travel_to_city" in fieldValue)
            temp.travel_to_city = fieldValue.travel_to_city ? "" : "City is required";

        if ("travel_from_country" in fieldValue)
            temp.travel_from_country = fieldValue.travel_from_country ? "" : "Country is required";
        if ("travel_from_city" in fieldValue)
            temp.travel_from_city = fieldValue.travel_from_city ? "" : "City is required";

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

    const handleAddPost = async () => {
        if (validations()) {
            const postData = new FormData();
            postData.append("title", formData.title);
            postData.append("travel_to_country", formData.travel_to_country);
            postData.append("travel_to_city", formData.travel_to_city);
            postData.append("travel_from_country", formData.travel_to_country);
            postData.append("travel_from_city", formData.travel_to_city);
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

            try {
                setIsLoading(true);
                const res = await postServices.createPost(postData); // Assuming postServices.createPost handles FormData
                if (res.status === 201) {
                    setIsLoading(false);
                    toast.success("Post created successfully");
                    setFormData(initialValues);
                    setPreviewImages([]);
                    setImageFiles([]);
                    navigate(-1);
                    dispatch(get_AllPosts());
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                // console.error(error?.response?.data?.errors[0]);
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
                        <Typography variant="h3">Add New Post</Typography>
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

                        {/* Travelling FROM */}

                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                sx={{ width: "100%" }} // Ensure it spans the full grid width
                                open={openFromCountry}
                                onOpen={handleOpenFromCountry}
                                onClose={handleCloseFromCountry}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value?.id
                                }
                                getOptionLabel={(option) => option.name || ""}
                                options={getCountries?.data || []}
                                value={
                                    getCountries?.data?.find(
                                        (item: any) => item.id === formData.travel_from_country
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: { name: "travel_from_country", value: newValue?.id || "" },
                                    });
                                }}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Country"
                                        variant="outlined"
                                        error={Boolean(errors.travel_from_country)}
                                        helperText={errors.travel_from_country}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
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
                                open={openFromCity}
                                onOpen={handleOpenFromCity}
                                onClose={handleCloseFromCity}
                                isOptionEqualToValue={(option, value) => option.id === value?.id}
                                getOptionLabel={(option) => option.name || ""}
                                options={cities_from || []}

                                value={
                                    cities_from?.find(
                                        (item) => item.id === formData.travel_from_city
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: { name: "travel_from_city", value: newValue?.id || "" },
                                    });
                                }}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="City"
                                        variant="outlined"
                                        error={Boolean(errors.travel_from_city)}
                                        helperText={errors.travel_from_city}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                        </Grid>


                        {/* Travelling To */}

                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                sx={{ width: "100%" }} // Ensure it spans the full grid width
                                open={openToCountry}
                                onOpen={handleOpenToCountry}
                                onClose={handleCloseToCountry}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value?.id
                                }
                                getOptionLabel={(option) => option.name || ""}
                                options={getCountries?.data || []}
                                value={
                                    getCountries?.data?.find(
                                        (item: any) => item.id === formData.travel_to_country
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: { name: "travel_to_country", value: newValue?.id || "" },
                                    });
                                }}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Country"
                                        variant="outlined"
                                        error={Boolean(errors.travel_to_country)}
                                        helperText={errors.travel_to_country}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {" "}
                            <Autocomplete
                                sx={{ width: "100%" }} // Ensure it spans the full grid width
                                open={openToCity}
                                onOpen={handleOpenToCity}
                                onClose={handleCloseToCity}
                                isOptionEqualToValue={(option, value) =>
                                    option.id === value?.id
                                }
                                getOptionLabel={(option) => option.name || ""}
                                options={cities_to || []}
                                value={
                                    cities_to?.find(
                                        (item: any) => item.id === formData.travel_to_city
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    handleChange({
                                        target: { name: "travel_to_city", value: newValue?.id || "" },
                                    });
                                }}
                                loading={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="City"
                                        variant="outlined"
                                        error={Boolean(errors.travel_to_city)}
                                        helperText={errors.travel_to_city}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {loading ? (
                                                        <CircularProgress color="inherit" size={20} />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
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
                            <Button variant="contained" size="large" onClick={handleAddPost}>
                                {isLoading ? "loading..." : "Add Post"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default AddPost;
