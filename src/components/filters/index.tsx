import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import { City, Country, FilterState } from "../../types";
import { filterStyles } from "../../pages/styles";
import postServices from "../../redux/api/postService";
import { GENDERS } from "../../Constants";


interface FiltersProps {
  filters: FilterState;
  setFilters : (filters : FilterState)=> void,
}

const Filters: React.FC<FiltersProps> = ({ filters,setFilters }) => {
  
    const [countries,setCountries] = useState<Array<Country>>([])
    const [cities,setCities] = useState<Array<City>>([])

       
  
  useEffect(()=>{
     postServices.getAllCountries().then(res=>{
        setCountries(res.data)
    })
    .catch(error=>{
        console.log(error)
        
    })
  },[])

  useEffect(() => {
    if (!filters.country) return;
    postServices.filterCityByCountryId(filters.country).then((res) => setCities(res.data)).catch(console.log);
  }, [filters.country]);


  
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
      country: '',
      city: '',
      gender: "",
      date_from : '',
      date_to : '',
    };

    setFilters(resetFilters);
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
          {countries?.map((country) => (
            <MenuItem key={country.id} value={country.id}>
              {country.name}
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
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {/* Gender Filter */}
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select name="gender" value={filters.gender} onChange={handleChange}>
          <MenuItem value="">All Genders</MenuItem>
          {GENDERS.map((gender) => (
            <MenuItem key={gender.value} value={gender.value}>
              {gender.display}
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
