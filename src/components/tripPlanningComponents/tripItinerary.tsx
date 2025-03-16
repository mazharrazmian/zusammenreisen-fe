import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  Paper,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlightIcon from '@mui/icons-material/Flight';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TripItinerary = ({ trip }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [expandedActivities, setExpandedActivities] = useState({});

  // Helper function to toggle activity expansion
  const handleExpandActivity = (activityId) => {
    setExpandedActivities({
      ...expandedActivities,
      [activityId]: !expandedActivities[activityId]
    });
  };

  // Group itinerary by days
  const days = trip.itinerary?.reduce((acc, item) => {
    const date = new Date(item.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {}) || {};

  // Sort days chronologically
  const sortedDays = Object.entries(days).sort(([dateA], [dateB]) => {
    return new Date(dateA) - new Date(dateB);
  });

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'restaurant':
      case 'food':
      case 'meal':
        return <RestaurantIcon />;
      case 'hotel':
      case 'accommodation':
        return <HotelIcon />;
      case 'car':
      case 'drive':
        return <DirectionsCarIcon />;
      case 'flight':
        return <FlightIcon />;
      default:
        return <LocationOnIcon />;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      return format(new Date(`2000-01-01T${timeString}`), 'h:mm a');
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMMM d');
  };

  // If no itinerary data
  if (sortedDays.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="h6" gutterBottom>
          No itinerary available yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Add activities to plan your trip
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
        >
          Add First Activity
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Trip Itinerary
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<AddIcon />}
        >
          Add Activity
        </Button>
      </Box>
      
      <Stepper activeStep={activeDay} orientation="vertical">
        {sortedDays.map(([date, activities], index) => (
          <Step key={date} expanded={true}>
            <StepLabel 
              onClick={() => setActiveDay(index)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography variant="subtitle1" fontWeight={activeDay === index ? 'bold' : 'normal'}>
                {formatDate(date)}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                {activities.map((activity) => (
                  <Card 
                    key={activity.id} 
                    variant="outlined" 
                    sx={{ mb: 2 }}
                  >
                    <CardContent sx={{ pb: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ mr: 1, color: 'primary.main' }}>
                          {getActivityIcon(activity.type)}
                        </Box>
                        <Typography variant="subtitle1" component="div">
                          {activity.title}
                        </Typography>
                        <Chip 
                          label={activity.type} 
                          size="small" 
                          sx={{ ml: 'auto' }} 
                          color="default"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatTime(activity.startTime)} {activity.endTime ? `- ${formatTime(activity.endTime)}` : ''}
                        </Typography>
                      </Box>
                      
                      {activity.location && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {activity.location}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                    
                    <CardActions disableSpacing>
                      <IconButton aria-label="edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <ExpandMore
                        expand={expandedActivities[activity.id]}
                        onClick={() => handleExpandActivity(activity.id)}
                        aria-expanded={expandedActivities[activity.id]}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    
                    <Collapse in={expandedActivities[activity.id]} timeout="auto" unmountOnExit>
                      <CardContent sx={{ pt: 0 }}>
                        {activity.description && (
                          <Typography paragraph>
                            {activity.description}
                          </Typography>
                        )}
                        
                        {activity.notes && (
                          <>
                            <Typography variant="subtitle2">Notes:</Typography>
                            <Typography paragraph variant="body2">
                              {activity.notes}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Collapse>
                  </Card>
                ))}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default TripItinerary;