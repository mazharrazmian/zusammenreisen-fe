import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import postServices from "../../../redux/api/postService";

interface City {
  id: number;
  name: string;
}

interface CitySelectProps {
  countryId: string | null;
  value: City | null;
  onChange: (city: City | null) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ countryId, value, onChange }) => {
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
      onChange={(_, newValue) => onChange(newValue)}
      loading={loading}
      disabled={!countryId}
      renderInput={(params) => <TextField {...params} label="Select City" variant="outlined" />}
    />
  );
};

export default CitySelect;
