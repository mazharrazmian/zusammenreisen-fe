import React from "react";
import { Autocomplete, TextField } from "@mui/material";

interface Country {
  id: string;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  value: Country | null;
  onChange: (country: Country | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ countries, value, onChange }) => {
  return (
    <Autocomplete
      options={countries}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Select Country" variant="outlined" />}
    />
  );
};

export default CountrySelect;
