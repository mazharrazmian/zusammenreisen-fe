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
    IconButton,
    InputAdornment,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Slider,
    Paper,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import { useNavigate, useParams } from "react-router-dom";
import { Delete, Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { accommodationTypes, ageGroups, tourTypes } from "../../Constants";
import CountrySelect from "../shared/countryCitySelector/countrySelect";
import CitySelect from "../shared/countryCitySelector/citySelect";
import Navbar from "../navbar";
import { useAppSelector } from "../../redux/store";
import postServices from "../../redux/api/postService";
import { TourDataInterface } from "../../types";



const initialValues: TourDataInterface = {
    title: "",
    description: "",
    itinerary: "",
    fromCountry: null,
    fromCity: null,
    toCountry: null,
    toCity: null,
    departureDate: "",
    returnDate: "",
    groupSize: 4,
    currentTravellers: 1,
    tourType: "adventure",
    activities: [],
    accommodationType: "hotel",
    estimatedCost: 0,
    ageGroup: "any",
    costIncludes: "",
    requirements: "",
    images: [],
    dates_flexible: false,
};


const TourForm = () => {
    const { tourId } = useParams(); // Get ID from URL (for edit mode)
    const isEditMode = Boolean(tourId); // Check if it's edit mode

    const navigate = useNavigate();
    const countries = useAppSelector(s => s.filter.countries);

    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [newActivity, setNewActivity] = useState("");



    // Fetch tour details if editing
    useEffect(() => {
        if (isEditMode) {
            fetchTour();
        }
    }, [isEditMode]);

    const convertUrlsToFiles = async (urls: Array<string>) => {
        const filePromises = urls.map(async (url) => {
            const response = await fetch(url, { mode: "cors" }); // Ensure CORS mode
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);

            const blob = await response.blob();
            const fileName = url.split("/").pop(); // Extract filename

            return new File([blob], fileName, { type: blob.type });
        });

        return Promise.all(filePromises);
    };

    const fetchTour = async () => {

        try {
            const res = await postServices.getPost(tourId);

            if (res.status === 200) {
                setFormData({
                    title: res?.data?.title,
                    fromCountry: res?.data?.travel_from_country,
                    fromCity: res?.data?.travel_from_city,
                    toCountry: res?.data?.travel_to_country,
                    toCity: res?.data?.travel_to_city,
                    departureDate: res?.data?.date_from,
                    returnDate: res?.data?.date_to,
                    dates_flexible: res?.data?.dates_flexible,
                    description: res?.data?.description,
                    itinerary: res?.data?.itinerary,
                    groupSize: res?.data?.group_size,
                    currentTravellers: res?.data?.current_travellers,
                    tourType: res?.data?.tour_type,
                    activities: res?.data?.activities,
                    accommodationType: res?.data?.accommodation_type,
                    estimatedCost: res?.data?.estimated_cost,
                    ageGroup: res?.data?.age_group,
                    costIncludes: res?.data?.cost_includes,
                    requirements: res?.data?.requirements,
                    images: res?.data?.images


                });
                setPreviewImages(res?.data?.images || []);
                const images = res?.data?.images; // Assuming this is an array of URLs
                if (Array.isArray(images)) {
                    const imageFiles = await convertUrlsToFiles(images);
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

            setPreviewImages((prev) => [...prev, ...newPreviewArray]);
            setImageFiles((prev) => [...prev, ...newFileArray]);
        }
    };

    const handleImageRemove = (index: number) => {
        setPreviewImages((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });

        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value, checked } = e.target as any;
        if (name === 'dates_flexible') {
            setFormData((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name as string]: value,
            }));
        }
    };

    const handleAutoCompleteChange = (name: string, value: any) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddActivity = () => {
        if (newActivity.trim() !== "") {
            setFormData((prevData) => ({
                ...prevData,
                activities: [...prevData.activities, newActivity.trim()]
            }));
            setNewActivity("");
        }
    };

    const handleRemoveActivity = (index: number) => {
        setFormData((prevData) => ({
            ...prevData,
            activities: prevData.activities.filter((_, i) => i !== index)
        }));
    };



    const validations = (fieldValue = formData) => {
        const temp: { [key: string]: string } = { ...errors };
        if ("title" in fieldValue)
            temp.title = fieldValue.title ? "" : "Title is required";
        if ("description" in fieldValue)
            temp.description = fieldValue.description ? "" : "Description is required";
        if ("toCountry" in fieldValue)
            temp.toCountry = fieldValue.toCountry?.id ? "" : "Destination country is required";
        if ("toCity" in fieldValue)
            temp.toCity = fieldValue.toCity?.id ? "" : "Destination city is required";
        if ("fromCountry" in fieldValue)
            temp.fromCountry = fieldValue.fromCountry?.id ? "" : "Departure country is required";
        if ("fromCity" in fieldValue)
            temp.fromCity = fieldValue.fromCity?.id ? "" : "Departure city is required";
        if ("departureDate" in fieldValue)
            temp.departureDate = fieldValue.departureDate ? "" : "Departure date is required";
        if ("returnDate" in fieldValue)
            temp.returnDate = fieldValue.returnDate ? "" : "Return date is required";
        if ("groupSize" in fieldValue)
            temp.groupSize = fieldValue.groupSize > 0 ? "" : "Number of travelers must be positive";
        if ("estimatedCost" in fieldValue)
            temp.estimatedCost = fieldValue.estimatedCost >= 0 ? "" : "Cost cannot be negative";

        setErrors(temp);
        return Object.values(temp).every((x) => x === "");
    };

    const handleSubmit = async () => {
        if (validations()) {
            const tourData = new FormData();
            // Basic tour information
            tourData.append("title", formData.title);
            tourData.append("description", formData.description);
            tourData.append("itinerary", formData.itinerary);

            // Locations
            tourData.append("travel_to_country", formData.toCountry!.id);
            tourData.append("travel_to_city", formData.toCity!.id);
            tourData.append("travel_from_country", formData.fromCountry!.id!);
            tourData.append("travel_from_city", formData.fromCity!.id);

            // Dates
            tourData.append("date_from", formData.departureDate);
            tourData.append("date_to", formData.returnDate);
            tourData.append("dates_flexible", formData.dates_flexible ? "true" : "false");

            // Tour specifics
            tourData.append("group_size", String(formData.groupSize));
            tourData.append("current_travellers", String(formData.currentTravellers));
            tourData.append("tour_type", formData.tourType);
            formData.activities.forEach((activity, index) => {
                tourData.append(`activities[${index}]`, activity);
            });
            tourData.append("accommodation_type", formData.accommodationType);
            tourData.append("estimated_cost", String(formData.estimatedCost));
            tourData.append("cost_includes", formData.costIncludes);
            tourData.append("requirements", formData.requirements);
            tourData.append("age_group", formData.ageGroup);

            // Images
            imageFiles.forEach((file) => {
                tourData.append("images", file);
            });

            try {
                setIsLoading(true);

                if (isEditMode) {
                    const res = await postServices.editPost(parseInt(tourId), tourData); // Assuming postServices.createPost handles FormData
                    if (res.status === 200) {
                        setIsLoading(false);
                        toast.success("Post Edited Successfully");
                        navigate(-1);
                    } else {
                        setIsLoading(false);
                    }
                }

                else {
                    const res = await postServices.createPost(tourData);
                    if (res.status === 201) {
                        setIsLoading(false);
                        toast.success("Tour created successfully");
                        setFormData(initialValues);
                        setPreviewImages([]);
                        setImageFiles([]);
                        navigate(-1);
                    } else {
                        setIsLoading(false);
                    }
                }


            } catch (error: any) {
                toast.error(
                    `${error?.response?.data?.errors[0]?.detail} (${error?.response?.data?.errors[0]?.attr})
                    `
                );
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <Container maxWidth="md">

                <Card sx={{ mt: 4, p: 2, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {isEditMode ? 
                    'Edit Your Trip'
                    
                    :

                    'Create A New Tour'
                    
                    }
                    </Typography>
                    {
                        !isEditMode && 
                        <Typography variant="body2" color="text.secondary">
                        Create an exciting tour and find travelers to join your adventure.
                    </Typography>
                    }
                    
                    <Divider sx={{ my: 2 }} />
                    <CardContent>
                        {/* Basic Tour Information */}
                        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
                            Tour Details
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Tour Title"
                                    fullWidth
                                    variant="outlined"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    helperText={errors.title}
                                    error={Boolean(errors.title)}
                                    placeholder="e.g., '7-Day Hiking Adventure in Swiss Alps'"
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Tour Description"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    slotProps={{ htmlInput: { maxLength: 300 } }}
                                    variant="outlined"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    helperText={errors.description}
                                    error={Boolean(errors.description)}
                                    placeholder="Provide an overview of your tour - what makes it special? Max 300 characters"
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Detailed Itinerary"
                                    fullWidth
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    name="itinerary"
                                    value={formData.itinerary}
                                    onChange={handleChange}
                                    placeholder="Day 1: Arrival and welcome dinner
Day 2: Morning hike, afternoon free time
Day 3: Full day excursion to..."
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Tour Type</InputLabel>
                                    <Select
                                        name="tourType"
                                        value={formData.tourType}
                                        onChange={handleChange}
                                        label="Tour Type"
                                    >
                                        {tourTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Accommodation Type</InputLabel>
                                    <Select
                                        name="accommodationType"
                                        value={formData.accommodationType}
                                        onChange={handleChange}
                                        label="Accommodation Type"
                                    >
                                        {accommodationTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Travel Details */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            Travel Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Divider sx={{ my: 1 }}><Typography variant="subtitle2">Departure From</Typography></Divider>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CountrySelect
                                    name="fromCountry"
                                    countries={countries}
                                    value={formData.fromCountry}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.fromCountry}
                                    error={Boolean(errors.fromCountry)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CitySelect
                                    name="fromCity"
                                    countryId={formData.fromCountry?.id || null}
                                    value={formData.fromCity}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.fromCity}
                                    error={Boolean(errors.fromCity)}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Divider sx={{ my: 1 }}><Typography variant="subtitle2">Destination</Typography></Divider>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CountrySelect
                                    name="toCountry"
                                    countries={countries}
                                    value={formData.toCountry}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.toCountry}
                                    error={Boolean(errors.toCountry)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <CitySelect
                                    name="toCity"
                                    countryId={formData.toCountry?.id || null}
                                    value={formData.toCity}
                                    onChange={handleAutoCompleteChange}
                                    helperText={errors.toCity}
                                    error={Boolean(errors.toCity)}
                                />
                            </Grid>
                        </Grid>

                        {/* Dates & Group Size */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            Dates & Group Size
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
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
                            <Grid size={{ xs: 12, sm: 6 }}>
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
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControlLabel
                                    control={<Checkbox checked={formData.dates_flexible} onChange={handleChange} name="dates_flexible" />}
                                    label="Are your dates flexible?"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Age Group</InputLabel>
                                    <Select
                                        name="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={handleChange}
                                        label="Age Group"
                                    >
                                        {ageGroups.map((group) => (
                                            <MenuItem key={group} value={group}>
                                                {group}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>


                        </Grid>

                        {/* Activities */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            Tour Activities
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label="Add Activity"
                                    variant="outlined"
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    fullWidth
                                    placeholder="e.g., Hiking, Snorkeling, Museum Visit"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleAddActivity} edge="end" color="primary">
                                                    <Add />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddActivity();
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.activities.map((activity, index) => (
                                        <Chip
                                            key={index}
                                            label={activity}
                                            onDelete={() => handleRemoveActivity(index)}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                    {formData.activities.length === 0 && (
                                        <Typography variant="body2" color="text.secondary">
                                            No activities added yet
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Cost Details */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            Cost Details
                        </Typography>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" gutterBottom>
                                    Group Size (including you): {formData.groupSize}
                                </Typography>
                                <Slider
                                    value={formData.groupSize}
                                    onChange={(_, newValue) =>
                                        setFormData((prev) => ({ ...prev, groupSize: newValue as number }))
                                    }
                                    min={1}
                                    max={20}
                                    step={1}
                                    marks={[
                                        { value: 1, label: '1' },
                                        { value: 5, label: '5' },
                                        { value: 10, label: '10' },
                                        { value: 15, label: '15' },
                                        { value: 20, label: '20' }
                                    ]}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }} sx={{ marginTop: 2 }}>
                                <TextField
                                    label="Estimated Cost per Person"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    name="estimatedCost"
                                    value={formData.estimatedCost}
                                    onChange={handleChange}
                                    helperText={errors.estimatedCost}
                                    error={Boolean(errors.estimatedCost)}
                                    onWheel={(e) => e.target.blur()}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    }}
                                />
                            </Grid>


                            <Grid size={{ xs: 12, sm: 6 }} sx={{ marginTop: { xs: 0, sm: 2 } }} >
                                <TextField
                                    label="No of People Already On Board"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    name="currentTravellers"
                                    value={formData.currentTravellers}
                                    onChange={handleChange}
                                    helperText={errors.currentTravellers}
                                    error={Boolean(errors.currentTravellers)}
                                    onWheel={(e) => e.target.blur()}

                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="What's Included in the Cost"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    name="costIncludes"
                                    value={formData.costIncludes}
                                    onChange={handleChange}
                                    placeholder="e.g., Accommodation, Local transportation, Breakfast daily, Entry fees"
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Special Requirements or Restrictions"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="e.g., Moderate fitness level required, Not suitable for children under 12"
                                />
                            </Grid>
                        </Grid>

                        {/* Images */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            Tour Images
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<Add />}
                                    color="primary"
                                >
                                    Upload Tour Images
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    Add attractive images of the destinations and activities to entice travelers to join <br></br>
                                    The first image will be used as a thumbnail of your Tour.
                                </Typography>
                            </Grid>

                            <Grid size={12} sx={{ mt: 2 }}>
                                <Box sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                    gap: 2
                                }}>
                                    {previewImages?.length > 0 ? (
                                        previewImages?.map((img, index) => (
                                            <Paper
                                                key={index}
                                                elevation={2}
                                                sx={{
                                                    position: 'relative',
                                                    height: 140,
                                                    overflow: 'hidden',
                                                    borderRadius: 2
                                                }}
                                            >
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
                                                        background: "rgba(0, 0, 0, 0.5)",
                                                        color: "white",
                                                        "&:hover": {
                                                            background: "rgba(0, 0, 0, 0.7)",
                                                        }
                                                    }}
                                                    size="small"
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </Paper>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No images uploaded yet
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", p: 3 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            sx={{ borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            sx={{
                                borderRadius: 2,
                                px: 4
                            }}
                        >
                            {isLoading ? <CircularProgress size={24} /> :
                            
                            <>
                            {
                                isEditMode ? 'Submit Changes' 
                                :
                                'Create Tour'
                            }
                            </>
                            
                            }
                        </Button>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
};

export default TourForm;