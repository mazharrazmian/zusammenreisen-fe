import React, { useEffect, useState } from "react";
import { Autocomplete, ListItemText, TextField } from "@mui/material";
import postServices from "../../../redux/api/postService";

import { City } from "../../../types";

interface CitySelectProps {
  countryId: string | null;
  value: City | null;
  onChange: (fieldname :string ,city: City | null) => void;
  name : string,
  helperText : string,
  error : boolean,
}

const CitySelect: React.FC<CitySelectProps> = ({ countryId, value, onChange,name , helperText , error}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setCities([]);
      return;
    }

    setLoading(true);
      postServices.filterCityByCountryId(countryId)
      .then((response) => setCities(response.data))
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, [countryId]);



  return (
    <Autocomplete
      options={cities}
      getOptionLabel={(option) => option.name}
      value={value}
      onChange={(_, newValue) => onChange(name,newValue)}
      loading={loading}
      disabled={!countryId}
      renderInput={(params) => <TextField helperText={helperText} error={error} name={name} {...params} label="Select City" variant="outlined" />}
      renderOption={(props, item) => (
        <li {...props} key={item.id}>
          <ListItemText>{item.name}</ListItemText>
        </li>
)}
      />
  );
};

export default CitySelect;
