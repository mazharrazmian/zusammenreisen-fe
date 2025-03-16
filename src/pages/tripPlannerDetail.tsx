import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Tabs,
  Tab,
  Button,
  Divider,
  CircularProgress,
  Avatar,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from 'react-router-dom';

import TripDetailHeader from '../components/TripDetailHeader';
import ParticipantsList from '../components/ParticipantsList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TripItinerary from '../components/TripItinerary';
import FileSharing from '../components/FileSharing';
import NotificationSettings from '../components/NotificationSettings';
import { fetchTripDetails } from '../services/tripService';
import { useTripMessages } from '../hooks/useTripMessages';

const TripPlannerDetail = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const { messages, sendMessage, loading: messagesLoading } = useTripMessages(tripId);

  useEffect(() => {
    const loadTripDetails = async () => {
      try {
        setLoading(true);
        const tripData = await fetchTripDetails(tripId);
        setTrip(tripData);
      } catch (error) {
        console.error('Error loading trip details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTripDetails();
  }, [tripId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSendMessage = (messageText, attachments = []) => {
    sendMessage({
      text: messageText,
      attachments,
      tripId,
      userId: 'current-user-id', // In a real app, get this from auth context
      timestamp: new Date().toISOString()
    });
  };

  const handleBack = () => {
    navigate('/trips');
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
            Trip Details
          </Typography>
          <IconButton color={showSettings ? "primary" : "default"} onClick={() => setShowSettings(!showSettings)}>
            <SettingsIcon />
          </IconButton>
        </Box>
        
        {trip && <TripDetailHeader trip={trip} />}
        
        <Box sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="trip detail tabs"
            variant="fullWidth"
          >
            <Tab label="Group Chat" />
            <Tab label="Itinerary" />
            <Tab label="Files" />
            <Tab label="Participants" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Paper sx={{ p: 0, height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              <MessageList messages={messages} currentUserId="current-user-id" loading={messagesLoading} />
            </Box>
            <Divider />
            <Box sx={{ p: 2 }}>
              <MessageInput onSendMessage={handleSendMessage} />
            </Box>
          </Paper>
        )}
        
        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            {/* <TripItinerary trip={trip} /> */}
          </Paper>
        )}
        
        {tabValue === 2 && (
          <Paper sx={{ p: 3 }}>
            <FileSharing tripId={tripId} />
          </Paper>
        )}
        
        {tabValue === 3 && (
          <Paper sx={{ p: 3 }}>
            <ParticipantsList participants={trip.participants} />
          </Paper>
        )}
        
        {showSettings && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <NotificationSettings tripId={tripId} />
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default TripPlannerDetail;