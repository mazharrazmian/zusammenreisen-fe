import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import ParticipantsSection from '../components/tripPlanningComponents/tripParticipantsSection';
import CommentsSection from '../components/tripPlanningComponents/plannerComment';
import TripDetailsHeader from '../components/tripPlanningComponents/tripPlanDetailHeader';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../redux/store';
import { tripService } from '../redux/api/tripPlanningService';
import { handleApiError } from '../redux/api/http-common';
import { toast } from 'react-toastify';

const TripPlannerPage = () => {
  // In a real app, this would be fetched from an API
  const { id } = useParams<{ id: string }>();
  const [tripDetails,setTripDetails] = useState(null)
  const [loading,setLoading] = useState(false)

  useEffect(()=>{

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


  // Function to poll comments
  const fetchComments = () => {
    tripService.getTripComments(id)
      .then(res => {
        setTripDetails(prev => ({
          ...prev,
          comments: res.data, // Update only the comments array
        }));
      })
      .catch(err => {
        console.error("Error fetching comments:", err);
      });
  };

  useEffect(() => {
    let interval;

    const startPolling = () => {
      fetchComments(); // Fetch immediately when the user is active
      interval = setInterval(fetchComments, 10 * 1000); // Fetch every 60 sec
    };

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval);
      }
    };

    // Listen to page visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startPolling();
      } else {
        stopPolling();
      }
    };

    // Start polling when the component mounts
    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function: stop polling and remove event listener on unmount
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [id]); // Re-run effect when the trip ID changes

  const onCommentDelete = (commentId)=>{
    tripService.deleteComment(commentId)
    .then(res=>{
        toast('Comment Deleted')
        fetchComments()
    })
  }

  const onCommentAdd = (comment) =>{
    tripService.createComment(comment)
    .then(res=>{
        setTripDetails((prev) => ({
            ...prev,
            comments: [...(prev?.comments || []), res.data], // Append new comment
          }));
    })
    .catch(err=>{
        console.log(err)
        handleApiError(err)
    })
  }

  return (
    
    <Container maxWidth="lg">
      <Box mt={4} mb={6}>
        <TripDetailsHeader tripDetails={tripDetails} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <CommentsSection comments={tripDetails?.comments} loading={loading} postID={id}
            onCommentDelete={onCommentDelete}
            onCommentAdd = {onCommentAdd}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <ParticipantsSection participants={tripDetails?.participants} loading={loading} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );




};

export default TripPlannerPage;