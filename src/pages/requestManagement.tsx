import React, { useState } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Container,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { InboxOutlined, OutboxOutlined } from '@mui/icons-material';
import Navbar from '../components/navbar';
import ReceivedRequests from '../components/tripRequests/receivedRequests';
import SentRequests from '../components/tripRequests/sentRequests';


const RequestManagementPage = () => {
  const [viewMode, setViewMode] = useState('received');

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "#000",
          top: "0",
          left: "0",
          right: "0",
          height: "100px",
        }}
      >
        <Navbar />
      </Box>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">Trip Requests</Typography>
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            aria-label="request view mode"
            size="small"
          >
            <ToggleButton value="received" aria-label="received requests">
              <InboxOutlined sx={{ mr: 1 }} />
              Received
            </ToggleButton>
            <ToggleButton value="sent" aria-label="sent requests">
              <OutboxOutlined sx={{ mr: 1 }} />
              Sent
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {viewMode === 'received' ? (
          <ReceivedRequests />
        ) : (
          <SentRequests />
        )}
      </Container>
    </>
  );
};

export default RequestManagementPage;