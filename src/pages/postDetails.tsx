import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack,
  Chat as ChatIcon,
  Language as LanguageIcon,
  LocationOn,
  CalendarMonth,
  AccessTime,
  Group as GroupIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  AttachMoney,
  Villa,
  DirectionsWalk,
  LocalActivity,
  Description,
  FlightTakeoff,
  FlightLand,
  Info,
  Assignment,
  EventNote,
  LocalOffer,
  Luggage,
  CreditCard,
  CheckCircle,
  Category
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useNavigate, useParams } from 'react-router-dom';
import postServices from '../redux/api/postService';
import { toast } from 'react-toastify';
import { formatDateWithOrdinal } from '../utils';
import chatServices from '../redux/api/chatServices';
import { handleApiError } from '../redux/api/http-common';
import Cookies from 'js-cookie';
import Navbar from '../components/navbar';
import { useAppSelector } from '../redux/store';
import JoinTripRequestModal from '../components/tripRequestModal';

const TravelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const profile = useAppSelector((s) => s.profile);
  const accessToken = Cookies.get('accessToken');
  const navigate = useNavigate();
  const [postData, setPostdata] = useState(null);
  const [openModal,setOpenModal]  = useState(false)
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    postServices.getPost(Number(id))
      .then(response => {
        setPostdata(response.data);
        setLoading(false);
      })
      .catch(error => {
        toast.error('Could not find your post');
        setLoading(false);
      });
  }, [id]);

//   const handleChat = () => {
//     if (!postData?.posted_by?.user.email) return;
    
//     chatServices.getChatRooms(postData.posted_by.user.email)
//       .then(response => {
//         if (response.data.length > 0) {
//           navigate(`/chat/${response.data[0].id}`);
//         } else {
//           let chatData = {
//             'second_participant': postData.posted_by.user.email
//           };
//           chatServices.createRoom(chatData)
//             .then(response => {
//               if (response?.status === 201) {
//                 navigate(`/chat/${response.data.id}`);
//               }
//             })
//             .catch(error => {
//               handleApiError(error);
//             });
//         }
//       });
//   };

  
const handleEdit = () => {
    navigate(`/edit/post/${postData?.id}`);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTourTypeIcon = (type) => {
    switch (type) {
      case 'adventure':
        return <DirectionsWalk />;
      case 'cultural':
        return <LocalActivity />;
      case 'beach':
        return <Luggage />;
      case 'mountain':
        return <Luggage />;
      case 'city':
        return <LocationOn />;
      case 'wildlife':
        return <Luggage />;
      case 'food':
        return <LocalOffer />;
      case 'photography':
        return <Luggage />;
      case 'backpacking':
        return <Luggage />;
      case 'luxury':
        return <CreditCard />;
      case 'budget':
        return <AttachMoney />;
      default:
        return <Category />;
    }
  };

  const getAccommodationIcon = (type) => {
    switch (type) {
      case 'hotel':
        return <Villa />;
      case 'hostel':
        return <Villa />;
      case 'apartment':
        return <Villa />;
      case 'camping':
        return <Villa />;
      case 'homestay':
        return <Villa />;
      case 'resort':
        return <Villa />;
      default:
        return <Villa />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 12 }}>
        <Navbar />
        <Container>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Loading travel details...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          background: "#000",
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          height: "100px",
          zIndex: '3',
        }}
      >
        <Navbar />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 12, mb: 6 }}>
        {/* Back button */}
        <Button 
          startIcon={<ArrowBack />}
          onClick={() => window.history.back()}
          sx={{ mb: 2 }}
        >
          Back to search
        </Button>
        
        {/* Title */}
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          {postData?.title}
          <Chip 
            label={postData?.tour_type}
            color="primary"
            size="small"
            icon={getTourTypeIcon(postData?.tour_type)}
            sx={{ ml: 2 }}
          />
        </Typography>

        {/* Main content grid */}
        <Grid container spacing={3}>
          {/* Left column - Gallery + Details */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Swiper
                key={postData?.images?.length}
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop
                style={{
                  height: '500px'
                }}
              >
                {postData?.images?.length > 0 ? (
                  postData.images.map((item, index) => (
                    <SwiperSlide key={index}>
                      <Box
                        component="img"
                        src={item}
                        alt={`Travel image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#f5f5f5'
                      }}
                    >
                      <Typography variant="subtitle1" color="text.secondary">
                        No images available
                      </Typography>
                    </Box>
                  </SwiperSlide>
                )}
              </Swiper>
            </Card>

            {/* Tabs Section */}
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Overview" icon={<Info />} iconPosition="start" />
                <Tab label="Itinerary" icon={<EventNote />} iconPosition="start" />
                <Tab label="Requirements" icon={<Assignment />} iconPosition="start" />
                <Tab label="Cost Details" icon={<AttachMoney />} iconPosition="start" />
              </Tabs>
              
              <CardContent>
                {/* Overview Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Trip Description
                    </Typography>
                    <Typography paragraph>
                      {postData?.description}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" gutterBottom>
                      Travel Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {/* From/To Details */}
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <FlightTakeoff color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">From</Typography>
                          </Stack>
                          <Typography variant="body1">
                            {`${postData?.travel_from_city?.name}, ${postData?.travel_from_country?.name}`}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <FlightLand color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">To</Typography>
                          </Stack>
                          <Typography variant="body1">
                            {`${postData?.travel_to_city?.name}, ${postData?.travel_to_country?.name}`}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {/* Dates */}
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <CalendarMonth color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Dates</Typography>
                            {postData?.dates_flexible && (
                              <Chip 
                                label="Flexible" 
                                size="small" 
                                color="success" 
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Stack>
                          <Typography variant="body1">
                            {`${formatDateWithOrdinal(postData?.date_from)} - ${formatDateWithOrdinal(postData?.date_to)}`}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {/* Activities */}
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                          Planned Activities
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {postData?.activities?.map((activity, index) => (
                            <Chip 
                              key={index}
                              label={activity}
                              icon={<LocalActivity fontSize="small" />}
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Grid>
                      
                      {/* Trip Preferences */}
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Trip Preferences
                          </Typography>
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <GroupIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                Group Size: {postData?.group_size} travelers
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PersonIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                Current Travelers: {postData?.current_travellers}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Category fontSize="small" color="action" />
                              <Typography variant="body2">
                                Age Group: {postData?.age_group}
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>
                      </Grid>
                      
                      {/* Accommodation */}
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Villa color="primary" />
                            <Typography variant="subtitle1" fontWeight="bold">Accommodation</Typography>
                          </Stack>
                          <Chip 
                            label={postData?.accommodation_type} 
                            icon={getAccommodationIcon(postData?.accommodation_type)}
                            variant="outlined"
                          />
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Itinerary Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Detailed Itinerary
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.8
                        }}
                      >
                        {postData?.itinerary}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                
                {/* Requirements Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Trip Requirements
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.8
                        }}
                      >
                        {postData?.requirements}
                      </Typography>
                    </Paper>
                  </Box>
                )}
                
                {/* Cost Details Tab */}
                {activeTab === 3 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Cost Information
                    </Typography>
                    <Paper elevation={2} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                      <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
                        {postData?.estimated_cost ? (
                          `$${postData.estimated_cost.toLocaleString()}`
                        ) : (
                          'Cost not specified'
                        )}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Estimated total per person
                      </Typography>
                    </Paper>
                    
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      What's included:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography
                        sx={{ 
                          whiteSpace: 'pre-line',
                          lineHeight: 1.8
                        }}
                      >
                        {postData?.cost_includes}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right column - User Profile & Chat */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    alt={postData?.posted_by?.user?.name}
                    src={postData?.posted_by?.picture}
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {postData?.posted_by?.user?.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      icon={<AccessTime fontSize="small" />}
                      label="Last active: 2 hours ago" 
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  {postData?.posted_by?.user.email === profile.profile.email && 
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Edit Post
                    </Button>
                    
                }
                  
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Languages
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {postData?.posted_by?.languages.map((lang) => (
                    <Chip
                      key={lang.name}
                      label={lang.name}
                      icon={<LanguageIcon fontSize="small" />}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                
              </CardContent>
            </Card>
            
            {/* Quick Stats Card */}
            <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trip Summary
                </Typography>
                
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CalendarMonth color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Duration" 
                      secondary={calculateDuration(postData?.date_from, postData?.date_to)} 
                    />
                  </ListItem>
                  
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <GroupIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Spots Left" 
                      secondary={`${postData?.group_size - postData?.current_travellers} available`} 
                    />
                  </ListItem>
                  
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getTourTypeIcon(postData?.tour_type)}
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tour Type" 
                      secondary={postData?.tour_type?.charAt(0).toUpperCase() + postData?.tour_type?.slice(1)} 
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Posted on
                  </Typography>
                  <Typography variant="body2">
                    {new Date(postData?.posted_on).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            {/* Call to Action */}
            {postData?.posted_by?.user.email !== profile?.profile?.email && (
              <Card 
                elevation={2} 
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    Interested in joining?
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Send a request to {postData?.posted_by?.user?.name} to be accepted to this Tour.
                  </Typography>
                  {
                    accessToken === undefined ?
                    <Button
                    color='primary'
                    variant='outlined'
                    startIcon={<ChatIcon />}
                    onClick={()=>navigate('/login')}
                    fullWidth
                    disabled
                    >
                    Login To Send Request
                    </Button>

                    :
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ChatIcon />}
                    onClick={()=>setOpenModal(true)}
                    fullWidth
                  >
                   Send Request
                  </Button>
                  }
                  
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      <JoinTripRequestModal open={openModal} handleClose={()=>setOpenModal(false)} tripDetails={postData}  />
    </>
  );
};

// Helper function to calculate trip duration
const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return `${diffDays} days`;
};

export default TravelDetails;