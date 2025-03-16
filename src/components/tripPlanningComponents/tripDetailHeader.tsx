import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Chip, 
  Button, 
  Grid,
  Avatar,
  AvatarGroup
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';

const TripDetailHeader = ({ trip }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'upcoming':
        return 'primary';
      case 'active':
        return 'success';
      case 'past':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Share trip', trip.id);
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${trip.image || 'https://source.unsplash.com/random?travel'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        position: 'relative',
        borderRadius: 2
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip 
              label={trip.status} 
              color={getStatusColor(trip.status)} 
              size="small" 
              sx={{ textTransform: 'capitalize', mr: 2 }}
            />
            {trip.isOwner && (
              <Chip label="You're the organizer" size="small" color="secondary" />
            )}
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {trip.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              {trip.location}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CalendarTodayIcon sx={{ mr: 1 }} />
            <Typography variant="body1">
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2, maxWidth: '80%' }}>
            {trip.description}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AvatarGroup max={5} sx={{ mr: 1 }}>
              {trip.participants.map(participant => (
                <Avatar 
                  key={participant.id} 
                  alt={participant.name} 
                  src={participant.avatar} 
                />
              ))}
            </AvatarGroup>
            <Typography variant="body2">
              {trip.participants.length} participant{trip.participants.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Share Trip
            </Button>
            
            {trip.isOwner && (
              <Button variant="outlined" color="secondary">
                Edit Trip
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TripDetailHeader;