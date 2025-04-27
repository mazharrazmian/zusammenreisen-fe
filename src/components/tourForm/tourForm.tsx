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
import { useTranslation } from "react-i18next";

import { tourTypesTranslations, accommodationTypesTranslations } from "../../Constants";
import { error } from "../../theme/palette";

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
    const { t ,i18n } = useTranslation('tourForm'); // Initialize translation hook
    const currentLanguage = i18n.language || 'en'; // Get current language, default to English

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

    //Add use effect for error state, if errors change scroll to the first error
    useEffect(() => {
        //firstError should be the key whose value is not ""
        //If there are any errors, scroll to the first error
        const firstError = Object.keys(errors).find(key => errors[key] !== "");
        if (firstError) {
            const element = document.querySelector(`[name="${firstError}"]`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }   , [errors]);

    // Helper function to get translated display value while maintaining English value
    const getTranslatedTourType = (englishValue: string) => {
        const index = tourTypesTranslations.en.findIndex(type => type === englishValue);
        return index !== -1 ? tourTypesTranslations[currentLanguage in tourTypesTranslations ? currentLanguage : 'en'][index] : englishValue;
    };

    const getTranslatedAccommodationType = (englishValue: string) => {
        const index = accommodationTypesTranslations.en.findIndex(type => type === englishValue);
        return index !== -1 ? accommodationTypesTranslations[currentLanguage in accommodationTypesTranslations ? currentLanguage : 'en'][index] : englishValue;
    };

    // Helper function to get English value from translated display value
    const getEnglishTourType = (translatedValue: string) => {
        const index = tourTypesTranslations[currentLanguage in tourTypesTranslations ? currentLanguage : 'en'].findIndex(type => type === translatedValue);
        return index !== -1 ? tourTypesTranslations.en[index] : translatedValue;
    };

    const getEnglishAccommodationType = (translatedValue: string) => {
        const index = accommodationTypesTranslations[currentLanguage in accommodationTypesTranslations ? currentLanguage : 'en'].findIndex(type => type === translatedValue);
        return index !== -1 ? accommodationTypesTranslations.en[index] : translatedValue;
    };

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
            toast.error(t('fetchError'));
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
        }
        else if (name === 'tourType') {
            // Convert translated value back to English before saving
            const englishValue = getEnglishTourType(value as string);
            setFormData((prevData) => ({
                ...prevData,
                [name]: englishValue,
            }));
        } else if (name === 'accommodationType') {
            // Convert translated value back to English before saving
            const englishValue = getEnglishAccommodationType(value as string);
            setFormData((prevData) => ({
                ...prevData,
                [name]: englishValue,
            }));
        } 
        else {
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
            temp.title = fieldValue.title ? "" : t('titleRequired');
        if ("description" in fieldValue)
            temp.description = fieldValue.description ? "" : t('descriptionRequired');
        if ("toCountry" in fieldValue)
            temp.toCountry = fieldValue.toCountry?.id ? "" : t('destinationCountryRequired');
        if ("toCity" in fieldValue)
            temp.toCity = fieldValue.toCity?.id ? "" : t('destinationCityRequired');
        if ("fromCountry" in fieldValue)
            temp.fromCountry = fieldValue.fromCountry?.id ? "" : t('departureCountryRequired');
        if ("fromCity" in fieldValue)
            temp.fromCity = fieldValue.fromCity?.id ? "" : t('departureCityRequired');
        if ("departureDate" in fieldValue)
            temp.departureDate = fieldValue.departureDate ? "" : t('departureDateRequired');
        if ("returnDate" in fieldValue)
            temp.returnDate = fieldValue.returnDate ? "" : t('returnDateRequired');
        if ("groupSize" in fieldValue)
            temp.groupSize = fieldValue.groupSize > 0 ? "" : t('positiveTravelersRequired');
        if ("estimatedCost" in fieldValue)
            temp.estimatedCost = fieldValue.estimatedCost >= 0 ? "" : t('nonNegativeCostRequired');

        if ("currentTravellers" in fieldValue)
            temp.currentTravellers = fieldValue.currentTravellers > 0 ? "" : t('positiveTravelersRequired');        

        if ("tourType" in fieldValue)
            temp.tourType = fieldValue.tourType ? "" : t('tourTypeRequired');
        if ("accommodationType" in fieldValue)
            temp.accommodationType = fieldValue.accommodationType ? "" : t('accommodationTypeRequired');
        if ("activities" in fieldValue)
            temp.activities = fieldValue.activities.length > 0 ? "" : t('activitiesRequired');
        if ("costIncludes" in fieldValue)
            temp.costIncludes = fieldValue.costIncludes ? "" : t('costIncludesRequired');
        if ("requirements" in fieldValue)
            temp.requirements = fieldValue.requirements ? "" : t('requirementsRequired');
        if ("ageGroup" in fieldValue)
            temp.ageGroup = fieldValue.ageGroup ? "" : t('ageGroupRequired');
        if ("itinerary" in fieldValue)
            temp.itinerary = fieldValue.itinerary ? "" : t('itineraryRequired');
        if ("images" in fieldValue)
            temp.images = imageFiles.length > 0 ? "" : t('imagesRequired');
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
                        toast.success(t('tourEditedSuccessfully'));
                        navigate(-1);
                    } else {
                        setIsLoading(false);
                    }
                } else {
                    const res = await postServices.createPost(tourData);
                    if (res.status === 201) {
                        setIsLoading(false);
                        toast.success(t('tourCreatedSuccessfully'));
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
                    `${error?.response?.data?.errors[0]?.detail} (${error?.response?.data?.errors[0]?.attr})`
                );
                setIsLoading(false);
            }
        } 
    };

    return (
        <>
            <Container maxWidth="md">
                <Card sx={{p: 2, mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        {isEditMode ? t('editYourTrip') : t('createNewTour')}
                    </Typography>
                    {
                        !isEditMode && 
                        <Typography variant="body2" color="text.secondary">
                            {t('createTourDescription')}
                        </Typography>
                    }
                    
                    <Divider sx={{ my: 2 }} />
                    <CardContent>
                        {/* Basic Tour Information */}
                        <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 500 }}>
                            {t('tourDetails')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label={t('tourTitle')}
                                    fullWidth
                                    variant="outlined"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    helperText={errors.title}
                                    error={Boolean(errors.title)}
                                    placeholder={t('tourTitlePlaceholder')}
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label={t('tourDescription')}
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
                                    placeholder={t('tourDescriptionPlaceholder')}
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label={t('detailedItinerary')}
                                    fullWidth
                                    multiline
                                    rows={5}
                                    variant="outlined"
                                    name="itinerary"
                                    value={formData.itinerary}
                                    onChange={handleChange}
                                    placeholder={t('detailedItineraryPlaceholder')}
                                    error={Boolean(errors.itinerary)}
                                    helperText={errors.itinerary}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t('tourType')}</InputLabel>
                                    <Select
                                        name="tourType"
                                        value={getTranslatedTourType(formData.tourType)}
                                        onChange={handleChange}
                                        label={t('tourType')}
                                    >
                                        {tourTypesTranslations[currentLanguage in tourTypesTranslations ? currentLanguage : 'en'].map((type, index) => (
                                            <MenuItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t('accommodationType')}</InputLabel>
                                    <Select
                                        name="accommodationType"
                                        value={getTranslatedAccommodationType(formData.accommodationType)}
                                        onChange={handleChange}
                                        label={t('accommodationType')}
                                    >
                                        {accommodationTypesTranslations[currentLanguage in accommodationTypesTranslations ? currentLanguage : 'en'].map((type, index) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {/* Travel Details */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            {t('travelInformation')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <Divider sx={{ my: 1 }}><Typography variant="subtitle2">{t('departureFrom')}</Typography></Divider>
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
                                <Divider sx={{ my: 1 }}><Typography variant="subtitle2">{t('destination')}</Typography></Divider>
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
                            {t('datesGroupSize')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label={t('departureDate')}
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
                                    label={t('returnDate')}
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
                                    label={t('datesFlexible')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>{t('ageGroup')}</InputLabel>
                                    <Select
                                        name="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={handleChange}
                                        label={t('ageGroup')}
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
                            {t('tourActivities')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={12}>
                                <TextField
                                    label={t('addActivity')}
                                    variant="outlined"
                                    value={newActivity}
                                    onChange={(e) => setNewActivity(e.target.value)}
                                    fullWidth
                                    name="activities"
                                    placeholder={t('addActivityPlaceholder')}
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
                                <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                                    {errors.activities}
                                </Typography>
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
                                            {t('noActivitiesAdded')}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Cost Details */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            {t('costDetails')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2" gutterBottom>
                                    {t('groupSize')} {formData.groupSize}
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
                                    name="groupSize"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }} sx={{ marginTop: 2 }}>
                                <TextField
                                    label={t('estimatedCost')}
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
                                    label={t('peopleOnBoard')}
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
                                    label={t('costIncludes')}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    name="costIncludes"
                                    value={formData.costIncludes}
                                    onChange={handleChange}
                                    placeholder={t('costIncludesPlaceholder')}
                                    error={Boolean(errors.costIncludes)}
                                    helperText={errors.costIncludes}
                                    
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label={t('specialRequirements')}
                                    fullWidth
                                    multiline
                                    rows={2}
                                    variant="outlined"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder={t('specialRequirementsPlaceholder')}
                                    error={Boolean(errors.requirements)}
                                    helperText={errors.requirements}
                                />
                            </Grid>
                        </Grid>

                        {/* Images */}
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                            {t('tourImages')}
                        </Typography>
                        <Grid container spacing={2}>
                            <Typography variant="body2" color="error.main" sx={{ mb: 1 }}>
                                {errors.images}
                            </Typography>
                            <Grid size={12}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<Add />}
                                    color="primary"
                                    
                                    
                                >
                                    {t('uploadTourImages')}
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        name="images"
                                    
                                    />
                                </Button>
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    {t('uploadTourImagesDescription')}
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
                                            {t('noImagesUploaded')}
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
                            {t('cancel')}
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
                                isEditMode ? t('submitChanges') 
                                :
                                t('createTour')
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