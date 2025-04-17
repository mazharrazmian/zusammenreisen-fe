import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Avatar, 
  AvatarGroup 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('triplist');
  
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleTripClick = (e) => {
    e.stopPropagation()
    navigate(`/tripplanner/${trip.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
          cursor: 'pointer'
        }
      }}
      onClick={handleTripClick}
    >
      <CardMedia
        component="img"
        height="140"
        image={trip.image || 'https://source.unsplash.com/random?travel'}
        alt={trip.title}
      />
      {/* <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
        <Chip 
          label={trip.status} 
          color={getStatusColor(trip.status)} 
          size="small" 
          sx={{ textTransform: 'capitalize' }}
        />
      </Box> */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {trip.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(trip.date_from)} - {formatDate(trip.date_to)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" noWrap>
            {trip.travel_to_city} , {trip.travel_to_country}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {trip.participants.length} {trip.participants.length !== 1 ? t('participants') : t('participant')}
            </Typography>
          </Box>
          
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            {trip.participants.map(participant => (
              <Avatar 
                key={participant.id} 
                alt={participant.user.name} 
                src={participant.picture} 
                sx={{ width: 24, height: 24 }}
              />
            ))}
          </AvatarGroup>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={(e) => {
            handleTripClick(e)
        }}>
          {t('viewDetails')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TripCard;