import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    MenuItem,
    Container,
    Typography,
    Box,
    IconButton,
    Autocomplete,
    CircularProgress,
    Divider,
    Checkbox,
    FormControlLabel,
} from "@mui/material";
import Grid from '@mui/material/Grid2';

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
import CountrySelect from "../components/shared/RichTextEditor/countrySelect";
import CitySelect from "../components/shared/RichTextEditor/citySelect";
import { City, Country } from "../types";

const CustomDetails = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        padding: "0px !important",
    },
    "& .MuiInputBase-inputMultiline": {
        height: "auto !important", // Ensures your style is applied
        overflow: "visible !important", // Allows content to grow
    },
});

export interface postDataInterface {
    title: string,
    fromCountry : null | Country ,
    fromCity : null | City,
    toCountry : null | Country,
    toCity : null | City,
    postalCode:string,
    departureDate: string,
    returnDate: string,
    text: string,
    gender: string,
    images: [],
    dates_flexible: boolean,
    no_of_other_people : null | number,
}

const initialValues :postDataInterface = {
    title: "",
    fromCountry : null ,
    fromCity : null,
    toCountry : null,
    toCity : null,
    postalCode: "",
    departureDate: "",
    returnDate: "",
    text: "",
    gender: "",
    images: [],
    dates_flexible: false,
    no_of_other_people : null,
};
const AddPost = () => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewImages, setPreviewImages] = React.useState<string[]>([]);
    const [imageFiles, setImageFiles] = React.useState<File[]>([]);
    
    const [countries,setCountries] = useState([])
       const [isLoading, setIsLoading] = React.useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
       
        postServices.getAllCountries()
        .then(res=>{
            setCountries(res.data)
        })
        .catch(error=>{
            console.log(error)
        })

    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name == 'dates_flexible'){
            setFormData((prevData) => ({ ...prevData, [name]: e.target.checked }));
            return 
        }
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        console.log(formData)
        validations({ [name]: value });
    };

    const handleAutoCompleteChange = (name :string , value : Country | City | null) =>{
        setFormData((prevData)=>({...prevData, [name] : value}))
    }

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
    
    const validations = (fieldValue = formData) => {
        const temp: { [key: string]: string } = { ...errors };
        if ("title" in fieldValue)
            temp.title = fieldValue.title ? "" : "Title is required";
        if ("toCountry" in fieldValue)
            temp.toCountry = fieldValue.toCountry?.id ? "" : "Country is required";
        if ("toCity" in fieldValue)
            temp.toCity = fieldValue.toCity?.id ? "" : "City is required";

        if ("fromCountry" in fieldValue)
            temp.fromCountry = fieldValue.fromCountry?.id ? "" : "Country is required";
        if ("fromCity" in fieldValue)
            temp.fromCity = fieldValue.fromCity?.id ? "" : "City is required";

        if ("departureDate" in fieldValue)
            temp.departureDate = fieldValue.departureDate
                ? ""
                : "Departure date is required";
        if ("returnDate" in fieldValue)
            temp.returnDate = fieldValue.returnDate ? "" : "Return date is required";
        if ("text" in fieldValue)
            temp.text = fieldValue.text ? "" : "This field is required";
        console.log(temp)
        setErrors(temp);
        return Object.values(temp).every((x) => x === "");
    };

    const handleAddPost = async () => {
        if (validations()) {
            const postData = new FormData();
            postData.append("title", formData.title);
            postData.append("travel_to_country", formData.toCountry!.id);
            postData.append("travel_to_city", formData.toCity!.id);
            postData.append("travel_from_country", formData.fromCountry!.id!);
            postData.append("travel_from_city", formData.fromCity!.id);
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
            // Display the key/value pairs
            // for (var pair of postData.entries()) {
            //     console.log(pair[0]+ ', ' + pair[1]); 
            // }
            // return
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

                <Grid sx={{
                    margin : '0% 5% 0% 5%'
                }} container spacing={2}>

                <Box>
                    <Box sx={addPostStyles.header}>
                        <Typography variant="h3">Add New Post</Typography>
                        <Button variant="contained" onClick={() => navigate(-1)}>
                            {" "}
                            Back
                        </Button>
                    </Box>
                    <Grid container spacing={2} >
                        <Grid size={{ xs: 12}}>
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
                                required
                            />
                        </Grid>

                      
                        {/* Travel From Section */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}><Typography variant="h6">Travel From</Typography></Divider>
                        </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CountrySelect
                                helperText={errors.fromCountry}
                                error={Boolean(errors.fromCountry)}
                                name='fromCountry' countries={countries} value={formData.fromCountry} onChange={handleAutoCompleteChange} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CitySelect helperText={errors.fromCity}
                                error={Boolean(errors.fromCity)} name='fromCity' countryId={formData.fromCountry?.id || null} value={formData.fromCity} onChange={handleAutoCompleteChange} />
                            </Grid>

                        {/* Travel To Section */}
                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}><Typography variant="h6">Travel To</Typography></Divider>
                        </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CountrySelect helperText={errors.toCountry}
                                error={Boolean(errors.toCountry)} name='toCountry' countries={countries} value={formData.toCountry} onChange={handleAutoCompleteChange} />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <CitySelect helperText={errors.toCountry}
                                error={Boolean(errors.toCity)} name='toCity' countryId={formData.toCountry?.id || null} value={formData.toCity} onChange={handleAutoCompleteChange} />
                            </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}><Typography variant="h6">Dates</Typography></Divider>
                        </Grid>

                    <Grid container size={{xs:12}} sx={{
                                justifyContent: "space-around",
                                alignItems: "center",
                            }}>

                        <Grid size={{ xs: 12, md: 3 }}>
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
                                required
                            />
                        </Grid>
                       
                        <Grid size={{ xs: 12, md: 3 }}>
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
                                required
                            />

                        </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControlLabel 
                            label="Are your dates flexible?"
                            control={<Checkbox checked={formData.dates_flexible} onChange={handleChange} />} 
                            name="dates_flexible"
                            />
                            </Grid>

                        </Grid>
                        <Grid size={{ xs: 12}}>
                            {" "}
                            <CustomDetails
                                label="Tell us about your plans"
                                fullWidth
                                multiline
                                variant="outlined"
                                rows={4}
                                name="text"
                                sx={{ height: "auto" }}
                                value={formData.text}
                                helperText={errors.text}
                                error={Boolean(errors.text)}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
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
                                required
                            >
                                <MenuItem value="1">Male</MenuItem>
                                <MenuItem value="0">Female</MenuItem>
                                <MenuItem value="2">other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            {" "}
                            <TextField
                                label="Other People"
                                fullWidth
                                name="no_of_other_people"
                                helperText={errors?.no_of_other_people

                                    ||

                                    "If you are not travelling alone. Write number of people."
                                }
                                value={formData?.no_of_other_people}
                                error={Boolean(errors?.no_of_other_people)}
                                onChange={handleChange}
                                type="number"
                            >
                                
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12}}>
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
                        <Grid size={{ xs: 12 }} >
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

                        <Grid size={12}>
                            {" "}
                            <Button variant="contained" size="large" onClick={handleAddPost}>
                                {isLoading ? "loading..." : "Add Post"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </>
    );
};

export default AddPost;
