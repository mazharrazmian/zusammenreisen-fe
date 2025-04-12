import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Country {
  id: string;
  name: string;
}

interface CountrySelectProps {
  countries: Country[];
  value: Country | null;
  name : string,
  onChange: (fieldname :string ,country: Country | null) => void;
  helperText : string,
  error : boolean,
}

const CountrySelect: React.FC<CountrySelectProps> = ({ countries, value, onChange,name,helperText,error }) => {
    const {t} = useTranslation('common');
  return (
    <Autocomplete
      options={countries}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(e, newValue) => onChange(name,newValue)}
      renderInput={(params) => <TextField helperText={helperText} error={error} name={name} {...params} label={t('selectCountry')} variant="outlined" />}
    />
  );
};

export default CountrySelect;
