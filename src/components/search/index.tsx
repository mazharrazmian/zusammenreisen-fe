import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Autocomplete,
  Grid2 as Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { homePageStyles } from "../../pages/styles";

interface Place {
  id: string;
  name: string;
}

interface SearchComponentProps {
  places: Place[]; // Update the type of places
}

const SearchComponent: React.FC<SearchComponentProps> = ({ places }) => {
  const [country_to, setCountry] = React.useState<string>(""); // Store the selected place ID
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");

  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams({
      ...(country_to && { country_to }), // Pass place ID
      ...(dateFrom && { date_from: dateFrom }),
      ...(dateTo && { date_to: dateTo }),
    }).toString();
    navigate(`/list?${params}`);
  };


  return (
    <Box sx={homePageStyles.searchBox}>
      <Grid container spacing={2}>
        <Grid size={{xs:12,md:4}}>
          <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
            Select Your Destination
          </Typography>
          <Autocomplete
            options={places}
            getOptionLabel={(option) => option?.name} // Display the name
            value={places?.find((place) => place?.id === country_to) || null} // Match ID to set the selected value
            onChange={(event, newValue) => setCountry(newValue ? newValue?.id : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select a place"
              />
            )}
          />
        </Grid>
        <Grid size={{xs:12,md:3}}>
          <Box>
            <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
              Departure Date
            </Typography>
            <TextField
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "17px 14px",
                },
              }}
              fullWidth
              type="date"
              variant="outlined"
              placeholder="Departure"
              onChange={(e) => setDateFrom(e.target.value)}
              value={dateFrom}
            />
          </Box>
        </Grid>
        <Grid size={{xs:12,md:3}}>
          <Box>
            <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
              Return Date
            </Typography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              placeholder="Return"
              onChange={(e) => setDateTo(e.target.value)}
              value={dateTo}
            />
          </Box>
        </Grid>

        <Grid
          size={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems:'end',
          }}
        >
          <Button sx={{paddingTop:'1em',paddingBottom:'1em',fontSize:'1em'}} variant="contained" onClick={handleSearch}>
            Find Travel Partners
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchComponent;
