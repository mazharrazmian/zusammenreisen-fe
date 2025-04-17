import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import { 
  TravelExplore, 
  CalendarMonth, 
  People, 
  Category,
  Backpack,
  AttachMoney,
  CheckCircleOutline
} from '@mui/icons-material';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const TripDetailsHeader = ({ tripDetails }: {tripDetails : any}) => {
  const { t } = useTranslation('tripdetails');

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {tripDetails?.title}
        </Typography>
        <Box display="flex" alignItems="center">
          <Avatar alt={tripDetails?.posted_by?.user.name} src={tripDetails?.posted_by?.picture} sx={{ mr: 1 }} />
          <Box>
            <Typography variant="subtitle2">{t('postedBy')} {tripDetails?.posted_by?.user.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('postedOn')} {moment(tripDetails?.posted_on).format('MMMM D, YYYY')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <TravelExplore color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1" fontWeight="medium">
              {tripDetails?.travel_from_city}, {tripDetails?.travel_from_country} {t('to')} {tripDetails?.travel_to_city}, {tripDetails?.travel_to_country}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <CalendarMonth color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {moment(tripDetails?.date_from).format('MMM D')} - {moment(tripDetails?.date_to).format('MMM D, YYYY')}
              {tripDetails?.dates_flexible && <Chip size="small" label="Flexible" sx={{ ml: 1 }} />}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <People color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {tripDetails?.current_travellers}/{tripDetails?.group_size} {t('travelers')} • {tripDetails?.age_group} {t('ageGroup')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <Category color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {t('tourType')} : {tripDetails?.tour_type }
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <Backpack color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {t('accomodation')} : {tripDetails?.accommodation_type}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoney color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {t('estimatedCost')} : {tripDetails?.estimated_cost }
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" mb={1}>{t('activities')}</Typography>
      <Box mb={2}>
        {tripDetails?.activities?.map((activity, index) => (
          <Chip 
            key={index} 
            label={activity} 
            sx={{ mr: 1, mb: 1, textTransform: 'capitalize' }} 
          />
        ))}
      </Box>

      <Typography variant="h6" mb={1}>{t('itinerary')}</Typography>
      <Typography
        sx={{
          whiteSpace: 'pre-line',
          lineHeight: 1.8
        }}
      >
        {tripDetails?.itinerary}
      </Typography>

      <Typography variant="h6" mb={1}>{t('description')}</Typography>
      <Typography variant="body2" paragraph>
        {tripDetails?.description}
      </Typography>
    </Paper>
  );
};

export default TripDetailsHeader;