import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    TextField,
    Divider,
    Paper,
} from "@mui/material";
import { City, FilterState } from "../../types";
import { filterStyles } from "../../pages/styles";
import postServices from "../../redux/api/postService";
import { GENDERS } from "../../Constants";
import { useAppSelector } from "../../redux/store";

interface FiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void,
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters }) => {
    const countries = useAppSelector(s => s.filter.countries);
    const [toCities, setToCities] = useState<Array<City>>([]);
    const [fromCities, setFromCities] = useState<Array<City>>([]);

    // Load cities when country_to changes
    useEffect(() => {
        if (!filters.country_to) return;
        postServices.filterCityByCountryId(filters.country_to)
            .then((res) => setToCities(res.data))
            .catch(console.log);
    }, [filters.country_to]);

    // Load cities when country_from changes
    useEffect(() => {
        if (!filters.country_from) return;
        postServices.filterCityByCountryId(filters.country_from)
            .then((res) => setFromCities(res.data))
            .catch(console.log);
    }, [filters.country_from]);

    const handleChange = (
        e: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        if (!name) return;
        const newFilters = { ...filters, [name]: value as string, page: 1 };
        setFilters(newFilters);
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            country_to: '',
            city_to: '',
            country_from: '',
            city_from: '',
            gender: "",
            date_from: '',
            date_to: '',
            page: 1,
        };

        setFilters(resetFilters);
    };

    return (
        <Box sx={filterStyles.mainWrapper}>
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                Filters
            </Typography>

            {/* From Location Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    From Location
                </Typography>

                {/* country_from Filter */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel>Country</InputLabel>
                    <Select 
                        name="country_from" 
                        value={filters.country_from} 
                        onChange={handleChange}
                    >
                        <MenuItem value="">All Countries</MenuItem>
                        {countries?.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* city_from Filter */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel> City</InputLabel>
                    <Select 
                        name="city_from" 
                        value={filters.city_from} 
                        onChange={handleChange}
                    >
                        <MenuItem value="">All Cities</MenuItem>
                        {fromCities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* To Location Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, border: '1px solid #bbdefb' }}>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    To Location
                </Typography>

                {/* country_to Filter */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel shrink={!!filters.country_to}>Country</InputLabel>
                    <Select 
                        name="country_to" 
                        value={filters.country_to} 
                        onChange={handleChange}
                    >
                        <MenuItem value="">All Countries</MenuItem>
                        {countries?.map((country) => (
                            <MenuItem key={country.id} value={country.id}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* city_to Filter */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel>City</InputLabel>
                    <Select 
                        name="city_to" 
                        value={filters.city_to} 
                        onChange={handleChange}
                    >
                        <MenuItem value="">All Cities</MenuItem>
                        {toCities.map((city) => (
                            <MenuItem key={city.id} value={city.id}>
                                {city.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Paper>

            {/* Other Filters Section */}
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Additional Filters
                </Typography>

                {/* Gender Filter */}
                <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                    <InputLabel>Gender</InputLabel>
                    <Select 
                        name="gender" 
                        value={filters.gender} 
                        onChange={handleChange}
                        label='Gender'
                    >
                        <MenuItem value="">All Genders</MenuItem>
                        {GENDERS.map((gender) => (
                            <MenuItem key={gender.value} value={gender.value}>
                                {gender.display}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Date From Filter */}
                <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    label="Date From"
                    onChange={handleChange}
                    value={filters.date_from}
                    name="date_from"
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    helperText='Date Greater Than Or Equal To'
                />

                {/* Date To Filter */}
                <TextField
                    fullWidth
                    type="date"
                    variant="outlined"
                    label="Date To"
                    onChange={handleChange}
                    value={filters.date_to}
                    name="date_to"
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    helperText='Date Less Than Or Equal To'
                />
            </Paper>

            {/* Reset Button */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleReset}
                fullWidth
            >
                Reset Filters
            </Button>
        </Box>
    );
};

export default Filters;