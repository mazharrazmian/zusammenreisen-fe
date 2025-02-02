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
  setURLParams: (params:string) => void;
  pageNumber : number,
}

const Filters: React.FC<FiltersProps> = ({ setURLParams,pageNumber }) => {
  
    const [countries,setCountries] = useState<Array<Country>>([])
    const [cities,setCities] = useState<Array<City>>([])

       

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    country: '',
    city: '',
    gender: "",
    date_from : '',
    date_to : '',
  });

  
  useEffect(()=>{
     postServices.getAllCountries().then(res=>{
        setCountries(res.data)
    })
    .catch(error=>{
        console.log(error)
        
    })
  },[])

  useEffect(()=>{
    if (filters.country == '' || filters.country == undefined){
       return
    }
    
    postServices.filterCityByCountryId(filters.country).then((res)=>{
        setCities(res.data)
    })
    .catch(error=>{
        console.log(error)
    })

  },[filters.country])


  useEffect(()=>{
    const params = new URLSearchParams({
        page: pageNumber.toString(),
        ...(filters.country && { country: filters.country }),
        ...(filters.city && { city: filters.city }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
        ...(filters.gender && { gender: String(filters.gender)}),

      }).toString();
      setURLParams(params)
  },[filters,pageNumber,setURLParams])

  const handleChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    
    if (!name) return;
    const newFilters = { ...filters, [name]: value as string };
    console.log(newFilters)
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
