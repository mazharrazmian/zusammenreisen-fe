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

    const countries = useAppSelector(s=>s.filter.countries)
    const [cities, setCities] = useState<Array<City>>([])


    useEffect(() => {
        if (!filters.country_to) return;
        postServices.filterCityByCountryId(filters.country_to).then((res) => setCities(res.data)).catch(console.log);
    }, [filters.country_to]);



    const handleChange = (
        e: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        if (!name) return;
        const newFilters = { ...filters, [name]: value as string };
        setFilters(newFilters);

    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            country_to: '',
            city_to: '',
            gender: "",
            date_from: '',
            date_to: '',
        };

        setFilters(resetFilters);
    };

    return (
        <Box sx={filterStyles.mainWrapper}>
        <Typography variant="h6" color="primary">
            Filters
        </Typography>
    
        {/* country_to Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel shrink={!!filters.country_to}>To Country</InputLabel>
            <Select name="country_to" value={filters.country_to} onChange={handleChange}>
                <MenuItem value="">All Countries</MenuItem>
                {countries?.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                        {country.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    
        {/* City Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel >To City</InputLabel>
            <Select name="city_to" value={filters.city_to} onChange={handleChange}>
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                        {city.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    
        {/* Gender Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel >Gender</InputLabel>
            <Select name="gender" value={filters.gender} onChange={handleChange}label='Gender' >
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
            helperText='Date Less Than Or Equal To'
            InputLabelProps={{ shrink: true }}
        />
    
        {/* Reset Button */}
        <Button
            variant="contained"
            color="primary"
            onClick={handleReset}
            fullWidth
            sx={{ mt: 2 }}
        >
            Reset Filters
        </Button>
    </Box>
    
    );
};

export default Filters;
