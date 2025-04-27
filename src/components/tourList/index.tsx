import { Avatar, Box, Button, Card, CardContent, CardMedia, Chip, Divider, Grid2 as Grid, Typography, useMediaQuery, } from "@mui/material"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { TourDataInterface } from "../../types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import { getTranslatedArray, tourTypes } from "../../Constants"; // Import helper and constants

const translatedTourTypes = getTranslatedArray({ en: tourTypes, de: tourTypes });

const TripList = ({posts} : {posts : Array<TourDataInterface>})=>{

    const navigate = useNavigate()
    const {t} = useTranslation('triplist')

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    
    // Check if tour is full
    const isTourFull = (tour) => {
      return tour.current_travellers >= tour.group_size;
    }
    
  // Check if tour is currently ongoing (started but not yet finished)
    const isTourStarted = (tour) => {
        const today = new Date();
        const startDate = new Date(tour.date_from);
        const endDate = new Date(tour.date_to);
        
        // Tour is ongoing if today is between start date and end date (inclusive)
        return startDate <= today && today <= endDate;
    };
    
    // Check if tour has already finished
    const isTourFinished = (tour) => {
        const today = new Date();
        const endDate = new Date(tour.date_to);
        
        // Tour is finished if today is after the end date
        return today > endDate;
    };
    
    return (
        posts.map(tour=>{
          const tourFull = isTourFull(tour);
          const tourStarted = isTourStarted(tour);
          const tourFinished = isTourFinished(tour);

          return (
            <Grid key={tour.id} size={{xs: 12, sm: 6, lg: 4}}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                },
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Tour Status Indicators */}
                {tourFull && (
                  <Chip
                    icon={<ErrorIcon />}
                    label={t("tourFull")}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      fontWeight: 'bold',
                      opacity: 0.9,
                    }}
                  />
                )}
                
                {tourStarted && !tourFull && (
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={t("ongoing")}
                    color="warning"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      fontWeight: 'bold',
                      opacity: 0.9,
                    }}
                  />
                )}

                {tourFinished && (
                  <Chip
                    icon={<ErrorIcon />}
                    label={t("tourFinished")}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 10,
                      fontWeight: 'bold',
                      opacity: 0.9,
                    }}
                  />
                )}
                
                {/* Tour Image */}
                
                <CardMedia
                  component="img"
                  height="200"
                  loading="lazy"
                  image={tour.image}
                  alt={tour.title}
                  sx={{filter: tourFinished ? 'grayscale(70%)' : 'none'}}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {tour.title}
                    </Typography>
                    <Chip 
                      label={translatedTourTypes[tourTypes.indexOf(tour.tour_type)] || tour.tour_type} 
                      size="small" 
                      color="primary" 
                      sx={{ fontWeight: 500 }} 
                    />
                  </Box>
                  
                  {/* Fixed alignment for the "from" field */}
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography color="text.primary" variant="body2" sx={{ minWidth: '40px' }}>
                      {t("from")}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {tour.travel_from_city}, {tour.travel_from_country}
                    </Typography>
                  </Box>
                  
                  {/* Fixed alignment for the "to" field */}
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <Typography color="text.primary" variant="body2" sx={{ minWidth: '40px' }}>
                      {t('to')}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {tour.travel_to_city}, {tour.travel_to_country}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(tour.date_from).toLocaleDateString('en-UK', { month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                    -
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarTodayIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(tour.date_to).toLocaleDateString('en-UK', { month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {!isMobile && ( 
                    <Typography variant="body2" color="text.primary" sx={{ mb: 2, height: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tour.description}
                    </Typography>
                  )}
                
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={tour.posted_by.picture} sx={{ width: 24, height: 24, mr: 1 }} />
                      <Typography variant="body2" fontWeight={500}>
                        {tour.posted_by.user.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon sx={{ fontSize: 18, color: tourFull ? 'error.main' : 'text.secondary', mr: 0.5 }} />
                      <Typography 
                        variant="body2" 
                        color={tourFull ? 'error.main' : 'text.secondary'}
                        fontWeight={tourFull ? 'bold' : 'normal'}
                      >
                        {tour.current_travellers}/{tour.group_size}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                    onClick={() => navigate(`posts/${tour.id}`)}
                  >
                     {t("viewDetails")}
                  </Button>
                </Box>
              </Card>
            </Grid>
          )
        })
    )
}

export default TripList