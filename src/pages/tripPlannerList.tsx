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
import postServices from '../redux/api/postService';
// import TripFilters from '../components/tripPlanningComponents/tripFilters';


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


  useEffect(() => {
    tripService.getUserTrips('')
    .then(res=>{
        console.log(res.data)
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
    // Filter by tab selection
    if (tabValue === 1 && trip.status !== 'upcoming') return false;
    if (tabValue === 2 && trip.status !== 'past') return false;
    
    // Filter by search query
    if (searchQuery && !trip.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && trip.status !== filters.status) {
      return false;
    }
    
    // Add more filter logic as needed
    
    return true;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Trips
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search trips..."
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
          
          {/* {showFilters && (
            <TripFilters filters={filters} onFilterChange={handleFilterChange} />
          )} */}
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="trip filter tabs"
            sx={{ mt: 2 }}
          >
            <Tab label="All Trips" />
            <Tab label="Upcoming" />
            <Tab label="Past" />
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
                No trips found. Try adjusting your filters.
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