import React, { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Container,
    Typography,
    Box,
    Grid,
    Divider,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CountrySelect from "../components/shared/RichTextEditor/countrySelect";
import CitySelect from "../components/shared/RichTextEditor/citySelect";
import postServices from "../redux/api/postService";
import { get_AllPosts } from "../redux/slice/postsSlice";

const initialValues = {
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
    no_of_other_people: null,
};

const AddPost = () => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        postServices.getAllCountries()
            .then(res => setCountries(res.data))
            .catch(error => console.log(error));
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "dates_flexible" ? checked : value,
        }));
    };

    const handleAutoCompleteChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPost = async () => {
        if (!formData.title || !formData.toCountry || !formData.toCity) {
            toast.error("Please fill in the required fields");
            return;
        }
        setIsLoading(true);
        try {
            const res = await postServices.createPost(formData);
            if (res.status === 201) {
                toast.success("Post created successfully");
                setFormData(initialValues);
                dispatch(get_AllPosts());
                navigate(-1);
            }
        } catch (error) {
            toast.error("Error creating post");
        }
        setIsLoading(false);
    };

    return (
        <Container maxWidth="md">
            <Card sx={{ mt: 4, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        Add New Post
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                fullWidth
                                variant="outlined"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CountrySelect name="fromCountry" countries={countries} value={formData.fromCountry} onChange={handleAutoCompleteChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CitySelect name="fromCity" countryId={formData.fromCountry?.id || null} value={formData.fromCity} onChange={handleAutoCompleteChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CountrySelect name="toCountry" countries={countries} value={formData.toCountry} onChange={handleAutoCompleteChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CitySelect name="toCity" countryId={formData.toCountry?.id || null} value={formData.toCity} onChange={handleAutoCompleteChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Departure Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Return Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox checked={formData.dates_flexible} onChange={handleChange} name="dates_flexible" />}
                                label="Are your dates flexible?"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Tell us about your plans"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                name="text"
                                value={formData.text}
                                onChange={handleChange}
                            />
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
    );
};

export default AddPost;
