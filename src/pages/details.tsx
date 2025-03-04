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
  Dialog,
  AppBar,
  Toolbar,
  Divider,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Chat as ChatIcon,
  Close as CloseIcon,
  Language as LanguageIcon,
  LocationOn,
  CalendarMonth,
  AccessTime,
  Group as GroupIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
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


const TravelDetails = () => {
    const { id } = useParams<{ id: string }>();
    const profile = useAppSelector((s) => s.profile);
    const accessToken = Cookies.get('accessToken')

    const navigate = useNavigate();
    const [postData,setPostdata] = useState([])
    const [isExpanded, setIsExpanded] = useState(false);


  useEffect(() => {
    postServices.getPost(Number(id))
    .then(response=>{
        setPostdata(response.data)
    })
    .catch(error=>{
        toast('couldnt find your post')
    })
  }, [id]);


  const handleChat = ()=>{
    chatServices.getChatRooms(postData?.posted_by?.user.email)
    .then(response=>{
        if (response.data.length > 0){
            navigate(`/chat/${response.data[0].id}`)
        }
        else{
            let chatData = {
                'second_participant' : postData?.posted_by?.user.email
            }
            chatServices.createRoom(chatData)
            .then(response=>{
                if (response?.status == 201){
                    navigate(`/chat/${response.data.id}`)
                }
            })
            .catch(error=>{
                handleApiError(error)
            })
        }
    })
  }

  console.log(postData?.posted_by?.languages)

  const handleEdit = ()=>{
    navigate(`/edit/post/${postData?.id}`)
  }


  const DetailItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const TravelPreference = () => (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Travel Preferences
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {
            postData?.no_of_other_people && 
            (
            <Tooltip title={postData?.no_of_other_people == 0 ? "Travelling alone" : `Travelling with ${postData?.no_of_other_people} companions`}>
          <Chip
            icon={postData?.no_of_other_people == 0 ? <PersonIcon /> : <GroupIcon />}
            label={postData?.no_of_other_people == 0 ? "Solo Traveller" : `Travelling With ${postData?.no_of_other_people} companions`}
            color="primary"
            variant="outlined"
          />
        </Tooltip>
            )
        }
        
      

        <Tooltip title={postData?.dates_flexible ? "Open to adjusting travel dates" : "Fixed travel dates"}>
          <Chip
            icon={<DateRangeIcon />}
            label={postData?.dates_flexible ? "Flexible Dates" : "Fixed Dates"}
            color={postData?.dates_flexible ? "success" : "default"}
            variant="outlined"
          />
        </Tooltip>
      </Box>
    </Box>
  );

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
            zIndex : '3',
        }}
    >
    <Navbar />
    </Box>

    <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
      <Card sx={{ position: 'relative', overflow: 'visible' }}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Left Column - Gallery */}
            <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative' }}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'white' }
                  }}
                  onClick={() => window.history.back()}
                >
                  <ArrowBack />
                </IconButton>
                <Swiper
                    key={postData?.images?.length}
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop
                    style={{
                        borderRadius: '16px',
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
                        <Typography>No images available</Typography>
                    )}
                    </Swiper>
              </Box>
            </Grid>

            {/* Right Column - User Details */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Avatar
                   alt={postData?.posted_by?.user?.name}
                    src={postData?.posted_by?.picture}
                    sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    {postData?.posted_by?.user?.name}
                  </Typography>
                 {
                    postData?.posted_by?.user.email != profile?.profile?.email 
                    ?
                    (
                        
                        <>
                        <Button
                        variant="contained"
                        startIcon={<ChatIcon />}
                        onClick={handleChat}
                        sx={{ mt: 2 }}
                        fullWidth
                        disabled={accessToken === undefined ? true : false}
                      >
                        {
                            accessToken === undefined ? 'Login to chat'
                            :
                            'Start Chat'
                        }
                      </Button>
                      </>

                    
                    )
                    :
                    (
                        <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{ mt: 2 }}
                        fullWidth
                      >
                        Edit Post
                      </Button>
                    )
                 }
                 
                </Box>

                <Divider sx={{ my: 3 }} />

                <DetailItem
                  icon={<LocationOn color="primary" />}
                  label="Traveling From"
                  value={`${postData?.travel_from_city?.name}, ${postData?.travel_from_country?.name}`}
                />
                <DetailItem
                  icon={<LocationOn color="primary" />}
                  label="Traveling To"
                  value={`${postData?.travel_to_city?.name}, ${postData?.travel_to_country?.name}`}
                />
                <DetailItem
                  icon={<CalendarMonth color="primary" />}
                  label="Travel Dates"
                  value={`${formatDateWithOrdinal(postData?.date_from)} - ${formatDateWithOrdinal(postData?.date_to)}`}
                />
                
                <DetailItem
                  icon={<LanguageIcon color="primary" />}
                  label="Languages"
                  value={
                    <Box sx={{ mt: 1 }}>
                      {postData?.posted_by?.languages.map((lang) => (
                        <Chip
                          key={lang.name}
                          label={lang.name}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  }
                />
                <DetailItem
                  icon={<AccessTime color="primary" />}
                  label="Last Active"
                  value="2 hours ago"
                />

                {/* New Travel Preferences Section */}
                <TravelPreference />
              </Box>
            </Grid>

            {/* About Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  maxHeight: isExpanded ? 'none' : '150px',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
               {postData?.text}
              </Typography>
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{ mt: 1, p: 0 }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      
    </Container>
    </>
  );
};

export default TravelDetails;