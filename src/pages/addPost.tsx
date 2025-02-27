import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Divider,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    CardMedia,
    IconButton,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CountrySelect from "../components/shared/RichTextEditor/countrySelect";
import CitySelect from "../components/shared/RichTextEditor/citySelect";
import postServices from "../redux/api/postService";
import { Delete } from "@mui/icons-material";
import { addPostStyles } from "./styles";
import Navbar from "../components/navbar";

import { City, Country } from "../types";
import { useAppSelector } from "../redux/store";

export interface postDataInterface {
    title : string,
    fromCountry : null | Country,
    fromCity : null | City,
    toCountry : null | Country,
    toCity : null | City,
    postalCode : string,
    departureDate : string,
    returnDate : string,
    text : string,
    gender : string,
    images : [],
    dates_flexible : boolean,
    travelling_in_group : boolean,
}

const initialValues : postDataInterface = {
    title: "",
    fromCountry: null,
    fromCity: null,
    toCountry: null,
    toCity: null,
    postalCode: "",
    departureDate: "",
    returnDate: "",
    text: "",
    gender: "",
    images: [],
    dates_flexible: false,
    travelling_in_group : false, //this is set to false. The state is logically inverted. But we use ! at the time of posting data
};



const AddPost = () => {

    const navigate = useNavigate();
    const countries = useAppSelector(s=>s.filter.countries)

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [previewImages, setPreviewImages] = React.useState<string[]>([]);
    const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;
        if (['dates_flexible','travelling_in_group'].includes(name)){
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        }
        else{
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
       
    };

    const handleAutoCompleteChange = (name : string, value : any) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
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
            if (formData.travelling_in_group === true){
                postData.append('travelling_alone','false');
            }
            else if (formData.travelling_in_group === false){
                postData.append('travelling_alone','true');
            }
            if (formData.dates_flexible === true){
                postData.append('dates_flexible','true')
            }

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
                } else {
                    setIsLoading(false);
                }
            } catch (error : any) {
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
            {/* <Box
                sx={{
                    background: "#000",
                    top: "0",
                    left: "0",
                    right: "0",
                    height: "100px",
                }}
            >
                <Navbar />
            </Box> */}

            <Container maxWidth="md">
                <Card sx={{ mt: 4, p: 2 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Add New Post
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Title"
                                    fullWidth
                                    variant="outlined"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    helperText={errors.title}
                                    error={Boolean(errors.title)}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Divider sx={{ my: 2 }}><Typography variant="h6">Travel From</Typography></Divider>
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <CountrySelect
                                    name="fromCountry"
                                    countries={countries}
                                    value={formData.fromCountry}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.fromCountry}
                                    error={Boolean(errors.fromCountry)}
            
                                />
                            </Grid>
                            <Grid  size={{xs:12 ,sm:6}}>
                                <CitySelect
                                    name="fromCity"
                                    countryId={formData.fromCountry?.id || null}
                                    value={formData.fromCity}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.fromCity}
                                    error={Boolean(errors.fromCity)}
                                />
                            </Grid>
                            <Grid  size={{xs:12}}>
                                <Divider sx={{ my: 2 }}><Typography variant="h6">Travel To</Typography></Divider>
                            </Grid>
                            <Grid size={{xs:12 ,sm:6}}>
                                <CountrySelect
                                    name="toCountry"
                                    countries={countries}
                                    value={formData.toCountry}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.toCountry}
                                    error={Boolean(errors.toCountry)}
                                />
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <CitySelect
                                    name="toCity"
                                    countryId={formData.toCountry?.id || null}
                                    value={formData.toCity}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.toCity}
                                    error={Boolean(errors.toCity)}
                                />
                            </Grid>
                            <Grid size={{xs:12}}>
                                <Divider sx={{ my: 2 }}><Typography variant="h6">Dates</Typography></Divider>
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <TextField
                                    label="Departure Date"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleChange}
                                    helperText={errors.departureDate}
                                    error={Boolean(errors.departureDate)}
                                />
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <TextField
                                    label="Return Date"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    name="returnDate"
                                    value={formData.returnDate}
                                    onChange={handleChange}
                                    helperText={errors.returnDate}
                                    error={Boolean(errors.returnDate)}
                                />
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <FormControlLabel
                                    control={<Checkbox checked={formData.dates_flexible} onChange={handleChange} name="dates_flexible" />}
                                    label="Are your dates flexible?"
                                />
                            </Grid>
                            <Grid size={{xs:12,sm:6}}>
                                <FormControlLabel
                                    control={<Checkbox checked={formData.travelling_in_group} onChange={handleChange} name="travelling_in_group" />}
                                    label="Are you travelling with other people (in a group)?"
                                />
                            </Grid>
                            <Grid size={{xs:12}}>
                                <TextField
                                    label="Tell us about your plans"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    helperText={errors.text}
                                    error={Boolean(errors.text)}
                                />
                            </Grid>

                            <Grid size={{xs:12}}>
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

                            <Grid size={{xs:12}} sx={{ marginTop: 5 }}>
                                <Box sx={addPostStyles.imageWrapper}>
                                    {previewImages?.length > 0 && (
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
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between" }}>
                        <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
                        <Button variant="contained" color="primary" onClick={handleAddPost} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : "Submit"}
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
};

export default AddPost;
