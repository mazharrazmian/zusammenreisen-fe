import React from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { homePageStyles } from "../../pages/styles";
import { AddCircleOutline } from "@mui/icons-material";

interface Place {
  id: string;
  name: string;
}

interface SearchComponentProps {
  places: Place[]; // Update the type of places
}

const SearchComponent: React.FC<SearchComponentProps> = ({ places }) => {
  const [to, setTo] = React.useState<string>(""); // Store the selected place ID
  const navigate = useNavigate();

  const handleSearch = () => {
    if (to) {
      navigate(`/list?to=${to}`); // Pass the ID in the query params
    }
  };

  return (
    <Box sx={homePageStyles.searchBox}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
            Find Your Place
          </Typography>
          <Autocomplete
            options={places}
            getOptionLabel={(option) => option?.name} // Display the name
            value={places?.find((place) => place?.id === to) || null} // Match ID to set the selected value
            onChange={(event, newValue) => setTo(newValue ? newValue?.id : "")}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select a place"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Box>
            <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
              Departure
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
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box>
            <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
              Return
            </Typography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              placeholder="Return"
            />
          </Box>
        </Grid>

        <Grid
          item
          xs={6}
          md={12}
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "end",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="searchBtn" onClick={() => navigate("/add/post")}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <AddCircleOutline />
              Add Post
            </Box>
          </Button>
        </Grid>
        <Grid
          item
          xs={6}
          md={12}
          sx={{
            display: "flex",
            alignItems: "end",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="searchBtn" onClick={handleSearch}>
            Find Place
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchComponent;
