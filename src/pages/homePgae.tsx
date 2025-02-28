import { Box, Button, Card, CardContent, CardMedia, Container, Grid2 as Grid, Rating, Typography } from "@mui/material";

import React, { useEffect, useMemo, useState } from "react";
import SearchComponent from "../components/search";
import { get_AllCountries } from "../redux/slice/filterSlice";
import { homePageStyles } from "./styles";
import postServices from "../redux/api/postService";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import AnimatedText from "../components/animateText/animateText";


const HomePage: React.FC = () => {
  const places = useAppSelector(s=>s.filter.countries)
  const navigate = useNavigate()
    

  const [featuredDestinations,setFeaturedDestinations] = useState([])
  useEffect(() => {
    postServices.getFeaturedDestinations()
    .then(response=>{
        setFeaturedDestinations(response.data)
    })
    .catch(error=>{
        console.log(error)
    })
  }, []);

  const memoizedAnimatedText = useMemo(() => <AnimatedText />, []);


  return (
    <>
    

      
    <Box sx={homePageStyles.mainWrapper}>
      {/* <img 
        src={animatedTextSvg} 
        alt="Zussamenreisen Cuts The Costs! Elevates The Fun" 
        style={{ maxWidth: '60%', height: 'auto' }}
      /> */}

      {memoizedAnimatedText}

    </Box>
        
    <SearchComponent places={places}  />


      {/* Below the Search */}

          {/* Featured Destinations */}
      <Box sx={{ backgroundColor: "#f8f9fa"}}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", marginBottom: "30px",textAlign:'center' }}>
            Featured Healing Destinations
          </Typography>
          <Grid container spacing={4}
          sx={{display:"flex",justifyContent:'center',alignContent:'space-between'}}
          >
            {featuredDestinations.map((destination) => (
              <Grid sx={{xs:12,sm:6,md:4}} key={destination.id}>
                <Card sx={{ 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  borderRadius: "12px",
                  overflow: "hidden",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6
                  }
                }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image}
                    alt={destination.country.name}
                  />
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1, width:300 }}>
                      <Typography variant="h6" component="h2">
                        {destination.city.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
  <Rating value={destination.ratings} precision={0.5} readOnly size="small" />
  <Typography variant="body2">{destination.ratings.toFixed(1)}</Typography>
</Box>

                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {destination.description}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                      sx={{ marginTop: 2 }}
                      onClick={()=>navigate(`/list?city=${destination.city.id}&country=${destination.country.id}`)}
                    >
                      Find Travellers
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


    </>
  );
};

export default HomePage;
