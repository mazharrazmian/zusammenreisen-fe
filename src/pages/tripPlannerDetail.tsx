import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import ParticipantsSection from '../components/tripPlanningComponents/tripParticipantsSection';
import CommentsSection from '../components/tripPlanningComponents/plannerComment';
import TripDetailsHeader from '../components/tripPlanningComponents/tripPlanDetailHeader';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { tripService } from '../redux/api/tripPlanningService';
import { handleApiError } from '../redux/api/http-common';

const TripPlannerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [tripDetails,setTripDetails] = useState(null)
  const [loading,setLoading] = useState(false)
  const profile = useAppSelector(s=>s.profile)

  useEffect(()=>{
    if (id === undefined) return
    tripService.getTripById(id)
    .then(res=>{
        setTripDetails(res.data)
    })
    .catch(err=>{
        console.log(err)
        handleApiError(err)
    })
    .finally(()=>{
        setLoading(false)
    })
  },[id])
  
  return (
    
    <Container maxWidth="lg">
      <Box mt={4} mb={6}>
        <TripDetailsHeader tripDetails={tripDetails} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <CommentsSection loading={loading} postID={id}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ParticipantsSection participants={tripDetails?.participants}
             loading={loading}
             tripId={id}
             currentUserId={profile?.profile?.profile?.id}
             postedBy={tripDetails?.posted_by?.id}
             // refresh page on participant removed
                onParticipantRemoved={(participantId) => {
                  setTripDetails((prev) => ({
                    ...prev,
                    participants: prev.participants.filter((p) => p.id !== participantId),
                  }));
                }
                }
             />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );




};

export default TripPlannerPage;