import { Box, Typography } from "@mui/material";

import React, { useEffect } from "react";
import SearchComponent from "../components/search";
import { get_AllCountries } from "../redux/slice/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { homePageStyles } from "./styles";

const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  const getCountries = useSelector((state) => state.filter);

  useEffect(() => {
    dispatch(get_AllCountries());
  }, []);
  const places = getCountries?.data || [];
  return (
    <>
      <Box sx={homePageStyles.mainWrapper}>
        <Typography
          variant="h1" // Use the predefined variant
          align="center" // Align text center using the Typography prop
          sx={{
            color: "white", // Explicitly set color to white
          }}
        >
          Find Your Healing Place <br /> With Traviz
        </Typography>
      </Box>
      <SearchComponent places={places} />
    </>
  );
};

export default HomePage;
