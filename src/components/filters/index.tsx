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
    Autocomplete,
} from "@mui/material";
import { City, Country, FilterState } from "../../types";
import { filterStyles } from "../../pages/styles";
import postServices from "../../redux/api/postService";
import { ageGroups, GENDERS } from "../../Constants";
import { useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import CircularProgress from '@mui/material/CircularProgress';

interface FiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void,
    onActiveFiltersChange?: (count: number) => void; // Add callback for active filters count

}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters,onActiveFiltersChange }) => {

    const {t} = useTranslation('filters')

    const countries = useAppSelector(s => s.filter.countries);
    const [toCities, setToCities] = useState<Array<City>>([]);
    const [fromCities, setFromCities] = useState<Array<City>>([]);
    const [isLoadingCitiesTo, setIsLoadingCitiesTo] = useState(false);
    const [isLoadingCitiesFrom, setIsLoadingCitiesFrom] = useState(false);

    // Calculate active filters count
    useEffect(() => {
        // Count non-empty filter values
        const activeFiltersCount = Object.entries(filters).reduce((count, [key, value]) => {
            // Skip page property and empty values
            if (key === 'page' || !value) return count;
            return count + 1;
        }, 0);
        
        // Call the callback if provided
        if (onActiveFiltersChange) {
            onActiveFiltersChange(activeFiltersCount);
        }
    }, [filters, onActiveFiltersChange]);

    // Load cities when country_to changes
    useEffect(() => {
        if (!filters.country_to) return;
        //Create a spinner while loading cities
        setIsLoadingCitiesTo(true);
        postServices.filterCityByCountryId(filters.country_to)
            .then((res) => setToCities(res.data))
            .catch(console.log)
            .finally(() => {
                setIsLoadingCitiesTo(false);
            });
    }, [filters.country_to]);

    // Load cities when country_from changes
    useEffect(() => {
        if (!filters.country_from) return;
        //Create a spinner while loading cities
        setIsLoadingCitiesFrom(true);
        postServices.filterCityByCountryId(filters.country_from)
        .then((res) => {
            console.log(res); // Add console.log after res to check response
            setFromCities(res.data);
        })
        .catch(err=>{console.log(err)})
        .finally(()=>{
            setIsLoadingCitiesFrom(false);
        })
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
            age_group: '',
            group_size: '',
            page: 1,
        };

        setFilters(resetFilters);
        if(onActiveFiltersChange) { 
        onActiveFiltersChange(0); // Reset active filters count
        }
    };

    return (
        <Box>
    <Typography variant="h6" color="info.dark" sx={{ mb: 2 }}>
        {t('filters')}
    </Typography>

    {/* From Location Section */}
    <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: '#f5f5f5', border: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle1" color="info.main" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('fromLocation')}
        </Typography>

        {/* country_from Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <Autocomplete
                value={countries.find(c => c.id == filters.country_from) || null}
                disablePortal
                isOptionEqualToValue={(option, value) => option.id == value.id}
                options={countries}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} name="country_from" label={t('country')} />}
                onChange={(event: any, newValue: any) => {
                    setFilters((prev: FilterState) => ({
                        ...prev,
                        country_from: newValue ? newValue.id : "",
                    }));
                }}
            />
        </FormControl>

        {/* city_from Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <Autocomplete
                value={fromCities.find(c => c.id == filters.city_from) || null}
                disablePortal
                isOptionEqualToValue={(option, value) => option.id == value.id}
                options={fromCities}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="city_from"
                        label={t('city')}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoadingCitiesFrom ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}                onChange={(event: any, newValue: City) => {
                    setFilters((prev: FilterState) => ({
                        ...prev,
                        city_from: newValue ? newValue.id : "",
                    }));
                }}
                // Add key equal to city.id in fromCities array
                key={filters.city_from}
                loading={isLoadingCitiesFrom}
                loadingText={t('loadingCities')}
                noOptionsText={t('noCities')}
            />
        </FormControl>
    </Paper>

    {/* To Location Section */}
    <Paper elevation={1} sx={{ p: 2, mb: 3, border: '1px solid #bbdefb' }}>
        <Typography variant="subtitle1" color="info.main" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('toLocation')}
        </Typography>

        {/* country_to Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <Autocomplete
                value={countries.find(c => c.id == filters.country_to) || null}
                disablePortal
                isOptionEqualToValue={(option, value) => option.id == value.id}
                options={countries}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} name="country_to" label={t('country')} />}
                onChange={(event: any, newValue: any) => {
                    setFilters((prev: FilterState) => ({
                        ...prev,
                        country_to: newValue ? newValue.id : "",
                    }));
                }}
            />
        </FormControl>

        {/* city_to Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <Autocomplete
                value={toCities.find(c => c.id == filters.city_to) || null}
                disablePortal
                isOptionEqualToValue={(option, value) => option.id == value.id}
                options={toCities}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                        {option.name}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name="city_to"
                        label={t('city')}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {isLoadingCitiesTo ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )} 
                onChange={(event: any, newValue: City) => {
                    setFilters((prev: FilterState) => ({
                        ...prev,
                        city_to: newValue ? newValue.id : "",
                    }));
                }}
                loading={isLoadingCitiesTo}
                loadingText={t('loadingCities')}
                noOptionsText={t('noCities')}
            />
        </FormControl>
    </Paper>

    {/* Other Filters Section */}
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" color="info.main" sx={{ mb: 1, fontWeight: 'bold' }}>
            {t('additionalFilters')}
        </Typography>

        {/* Gender Filter */}
        <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <Autocomplete
                options={GENDERS}
                getOptionLabel={(option) => option.display}
                value={GENDERS.find((g) => g.value === filters.gender) || null}
                onChange={(event, newValue) => handleChange({ target: { name: "gender", value: newValue ? newValue.value : "" } })}
                renderInput={(params) => <TextField {...params} label={t('gender')} variant="outlined" fullWidth />}
            />
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
            <InputLabel>{t('ageGroup')}</InputLabel>
            <Select
                name="age_group"
                value={filters.age_group}
                onChange={handleChange}
                label={t('ageGroup')}
            >
                {ageGroups.map((age) => (
                    <MenuItem key={age} value={age}>
                        {age}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>

        <FormControl fullWidth variant="outlined" sx={{ mt: 3 }}>
            <TextField
                fullWidth
                type="number"
                value={filters.group_size}
                onChange={handleChange}
                name="group_size"
                label={t('groupSize')}
            />
        </FormControl>

        {/* Date From Filter */}
        <TextField
            fullWidth
            type="date"
            variant="outlined"
            label={t('dateFrom')}
            onChange={handleChange}
            value={filters.date_from}
            name="date_from"
            sx={{ mt: 3 }}
            InputLabelProps={{ shrink: true }}
            helperText={t('dateGreaterThanOrEqual')}
        />

        {/* Date To Filter */}
        <TextField
            fullWidth
            type="date"
            variant="outlined"
            label={t('dateTo')}
            onChange={handleChange}
            value={filters.date_to}
            name="date_to"
            sx={{ mt: 3 }}
            InputLabelProps={{ shrink: true }}
            helperText={t('dateLessThanOrEqual')}
        />
    </Paper>

    {/* Reset Button */}
    <Button
        variant="contained"
        onClick={handleReset}
        fullWidth
        color="info"
    >
        {t('resetFilters')}
    </Button>
</Box>
    );
};

export default Filters;