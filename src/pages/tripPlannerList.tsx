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
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TripCard from '../components/tripPlanningComponents/tripCardComponent';
import { tripService } from '../redux/api/tripPlanningService';
import { useTranslation } from 'react-i18next';

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
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
    tripService.getUserTrips('')
    .then(res=>{
        setTrips(res.data)
    })
    .catch(err=>{
        console.log(err)
    })
    .finally(()=>setLoading(false))

  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTrips = trips.filter(trip => {
    const today = new Date();
    const tripStartDate = new Date(trip.date_from);
    const tripEndDate = new Date(trip.date_to);
    
    // Determine if the trip is upcoming or past based on dates
    const isUpcoming = tripStartDate > today; // Trip hasn't started yet
    const isPast = tripEndDate < today; // Trip has ended
    
    // Filter by tab selection
    if (tabValue === 1 && !isUpcoming) return false; // Upcoming trips tab
    if (tabValue === 2 && !isPast) return false; // Past trips tab
    
    // Filter by search query
    if (searchQuery && !trip.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status (if you still need status filtering)
    if (filters.status !== 'all') {
      if (filters.status === 'upcoming' && !isUpcoming) return false;
      if (filters.status === 'past' && !isPast) return false;
      if (filters.status === 'ongoing' && (isUpcoming || isPast)) return false; // Trip is currently running
    }
    
    // Add more filter logic as needed
    
    return true;
  });

  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('myTrips')}
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder={t('searchTrips')}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, mx: 0.5 }} orientation="vertical" />
            <IconButton 
              color={showFilters ? "primary" : "default"} 
              onClick={() => setShowFilters(!showFilters)}
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
            <Tab label={t('allTrips')} />
            <Tab label={t('upcoming')} />
            <Tab label={t('past')} />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {filteredTrips.length === 0 ? (
              <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                {t('noTripsFound')}
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredTrips.map((trip) => (
                  <Grid item xs={12} sm={6} md={4} key={trip.id}>
                    <TripCard trip={trip} />
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