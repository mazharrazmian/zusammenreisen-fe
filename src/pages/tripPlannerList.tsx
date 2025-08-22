import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  CircularProgress, 
  Tabs, 
  Tab, 
  Paper,
  InputBase,
  IconButton,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { tripService } from '../redux/api/tripPlanningService';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../redux/store';
import { useNavigate } from 'react-router-dom';
import ClickableAvatar from '../components/shared/clickableAvatar/clicakableAvatar';
import { Details } from '@mui/icons-material';

interface Trip {
  id: number;
  title: string;
  date_from: string;
  date_to: string;
  posted_by: {
    id: number;
    name: string;
    avatar?: string;
  };
  participants?: any[];
  location?: string;
  image?: string;
  slug?: string;
}

const MyTripsPage = () => {
  const profile = useAppSelector(s => s.profile);
  const navigate = useNavigate();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: null,
    participants: []
  });

  const { t } = useTranslation('triplist');

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = () => {
    setLoading(true);
    tripService.getUserTrips('')
      .then(res => {
        setTrips(res.data);
      })
      .catch(err => {
        console.log('Error loading trips:', err);
      })
      .finally(() => setLoading(false));
  };

  const handleTabChange = (event: any, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };


  const handleEditTrip = (trip: Trip) => {
    // Navigate to edit page
    navigate(`/edit/post/${trip?.slug}`);
  };

  const getTripStatus = (trip: Trip) => {
    const today = new Date();
    const tripStartDate = new Date(trip.date_from);
    const tripEndDate = new Date(trip.date_to);
    
    if (tripStartDate > today) return 'upcoming';
    if (tripEndDate < today) return 'past';
    return 'ongoing';
  };

  const isOwner = (trip: Trip) => {
    return trip.posted_by?.id === profile?.profile?.profile?.id;
  };

  const filteredTrips = trips.filter(trip => {
    const status = getTripStatus(trip);
    
    // Filter by tab selection
    if (tabValue === 1 && status !== 'upcoming') return false;
    if (tabValue === 2 && status !== 'past') return false;
    
    // Filter by search query
    if (searchQuery && !trip.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && filters.status !== status) {
      return false;
    }
    
    return true;
  });

  const getStatusChipProps = (status: string) => {
    switch (status) {
      case 'upcoming':
        return { label: t('upcoming') || 'Upcoming', color: 'primary' as const };
      case 'ongoing':
        return { label: t('ongoing') || 'Ongoing', color: 'success' as const };
      case 'past':
        return { label: t('past') || 'Past', color: 'default' as const };
      default:
        return { label: 'Unknown', color: 'default' as const };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const CustomTripCard = ({ trip }: { trip: Trip }) => {
    const status = getTripStatus(trip);
    const chipProps = getStatusChipProps(status);
    const owner = isOwner(trip);

    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {trip.image && (
          <CardMedia
            component="img"
            height="200"
            image={trip.image}
            alt={trip.title}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1 }}>
              {trip.title}
            </Typography>
            <Chip {...chipProps} size="small" />
          </Box>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(trip.date_from)} - {formatDate(trip.date_to)}
              </Typography>
            </Box>

            {trip.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {trip.location}
                </Typography>
              </Box>
            )}

            {trip.participants && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {trip.participants.length} {t('participants') || 'participants'}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex',alignItems:'start',gap:1 }}>
              <ClickableAvatar 
                    src={trip.posted_by?.picture}
                    navigateTo={`/profile/${trip.posted_by?.id}`}
                    fallbackName={trip.posted_by?.user.name}
                    size={32}
                    />
              <Typography variant="body2" color="text.secondary" sx={{mt:0.5}}>
                
                {owner ? t('yourTrip') || 'Your Trip' : `by ${trip.posted_by?.user?.name || 'Unknown'}`}
              </Typography>
            </Box>
          </Stack>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button 
            size="small" 
            onClick={() => navigate(`/tripplanner/${trip.id}`)}
          >
            {t('planTrip') || 'Plan Trip'}
          </Button>
          
          {owner ? (
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEditTrip(trip)}
              color="primary"
            >
              {t('edit') || 'Edit'}
            </Button>
          )
          :
          (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Details />}
              onClick={() => navigate(`/posts/${trip.slug}`)}
              color="primary"
            >
              {t('viewDetails') || 'View Details'}
            </Button>
          )
        }
        </CardActions>
      </Card>
    );
  };

  const getTabCounts = () => {
    const all = filteredTrips.length;
    const upcoming = trips.filter(trip => getTripStatus(trip) === 'upcoming').length;
    const past = trips.filter(trip => getTripStatus(trip) === 'past').length;
    
    return { all, upcoming, past };
  };

  const tabCounts = getTabCounts();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {t('myTrips')}
          </Typography>
        </Box>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={t('searchTrips') || 'Search your trips...'}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
            <IconButton 
              color={showFilters ? "primary" : "default"} 
              onClick={() => setShowFilters(!showFilters)}
              title={t('filters') || 'Filters'}
            >
              <FilterListIcon />
            </IconButton>
          </Box>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="trip filter tabs"
            sx={{ mt: 2 }}
          >
            <Tab 
              label={`${t('allTrips') || 'All Trips'} (${tabCounts.all})`} 
            />
            <Tab 
              label={`${t('upcoming') || 'Upcoming'} (${tabCounts.upcoming})`} 
            />
            <Tab 
              label={`${t('past') || 'Past'} (${tabCounts.past})`} 
            />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>{t('loadingTrips') || 'Loading trips...'}</Typography>
          </Box>
        ) : (
          <>
            {filteredTrips.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {t('noTripsFound') || 'No trips found'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {tabValue === 0 && (t('noTripsMessage') || "You haven't created or joined any trips yet.")}
                  {tabValue === 1 && (t('noUpcomingTrips') || 'No upcoming trips found.')}
                  {tabValue === 2 && (t('noPastTrips') || 'No past trips found.')}
                </Typography>
                {tabValue === 0 && (
                  <Button
                    variant="contained"
                    onClick={() => navigate('/add/post')}
                  >
                    {t('createFirstTrip') || 'Create Your First Trip'}
                  </Button>
                )}
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredTrips.map((trip) => (
                  <Grid item xs={12} sm={6} md={4} key={trip.id}>
                    <CustomTripCard trip={trip} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default MyTripsPage;