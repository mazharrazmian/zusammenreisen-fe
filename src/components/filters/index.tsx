import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FilterState } from "../../types";
import { filterStyles } from "../../pages/styles";

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  data: { data: any[] };
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange, data }) => {
  const posts = Array.isArray(data?.data) ? data.data : []; // Ensure posts is always an array

  // Extract unique filter options
  const countries = Array.from(
    new Set(posts?.map((post) => post?.travel_to_country)?.filter(Boolean))
  );
  const cities = Array.from(
    new Set(posts?.map((post) => post?.travel_to_city)?.filter(Boolean))
  );
  const genders = Array.from(
    new Set(
      posts
        ?.map((post) =>
          post?.posted_by?.gender !== undefined ? post?.posted_by?.gender : null
        )
        ?.filter((gender) => gender !== null)
    )
  );

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    country: "",
    city: "",
    postalCode: "",
    gender: "",
  });

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    const newFilters = { ...filters, [name]: value as string };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      country: "",
      city: "",
      postalCode: "",
      gender: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Box sx={filterStyles.mainWrapper}>
      <Typography variant="h6" color="primary">
        Filters
      </Typography>

      {/* Country Filter */}
      <FormControl fullWidth>
        <InputLabel>Country</InputLabel>
        <Select name="country" value={filters.country} onChange={handleChange}>
          <MenuItem value="">All Countries</MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* City Filter */}
      <FormControl fullWidth>
        <InputLabel>City</InputLabel>
        <Select name="city" value={filters.city} onChange={handleChange}>
          <MenuItem value="">All Cities</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Postal Code Filter */}
      <TextField
        name="postalCode"
        label="Postal Code"
        variant="outlined"
        value={filters.postalCode}
        onChange={(e) =>
          handleChange(
            e as unknown as React.ChangeEvent<{ name: string; value: string }>
          )
        }
        fullWidth
      />

      {/* Gender Filter */}
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={filters.gender} onChange={handleChange}>
          <MenuItem value="">All Genders</MenuItem>
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender === 0 ? "Male" : "Female"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
