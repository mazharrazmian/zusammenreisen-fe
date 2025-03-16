import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip,
  Slider,
  Button,
  Grid,
  IconButton,
  Collapse
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const TripFilters = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    dateFrom: null,
    dateTo: null,
    priceRange: [0, 5000],
    destinations: []
  });

  const [destination, setDestination] = useState('');

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleAddDestination = () => {
    if (destination && !filters.destinations.includes(destination)) {
      const newDestinations = [...filters.destinations, destination];
      handleFilterChange('destinations', newDestinations);
      setDestination('');
    }
  };

  const handleRemoveDestination = (destinationToRemove) => {
    const newDestinations = filters.destinations.filter(d => d !== destinationToRemove);
    handleFilterChange('destinations', newDestinations);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      status: 'all',
      dateFrom: null,
      dateTo: null, 
      priceRange: [0, 5000],
      destinations: []
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Paper elevation={1} sx={{ mb: 3, p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" onClick={() => setExpanded(!expanded)} sx={{ cursor: 'pointer' }}>
        <Typography variant="h6" component="h2" display="flex" alignItems="center">
          <FilterListIcon sx={{ mr: 1 }} /> Trip Filters
        </Typography>
        <IconButton>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search trips"
              variant="outlined"
              fullWidth
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              placeholder="Trip name, destination, etc."
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="upcoming">Upcoming</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending Approval</MenuItem>
                <MenuItem value="past">Past</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChange={(date) => handleFilterChange('dateFrom', date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                slotProps={{ textField: { fullWidth: true, margin: 'none' } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChange={(date) => handleFilterChange('dateTo', date)}
                slotProps={{ textField: { fullWidth: true, margin: 'none' } }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography gutterBottom>Price Range ($)</Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">${filters.priceRange[0]}</Typography>
              <Typography variant="body2">${filters.priceRange[1]}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" mb={1}>
              <TextField
                label="Add Destination"
                variant="outlined"
                size="small"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                sx={{ mr: 1, flexGrow: 1 }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddDestination}
                disabled={!destination}
              >
                Add
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filters.destinations.map((dest) => (
                <Chip 
                  key={dest}
                  label={dest}
                  onDelete={() => handleRemoveDestination(dest)}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button onClick={handleClearFilters} startIcon={<ClearIcon />}>
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default TripFilters;