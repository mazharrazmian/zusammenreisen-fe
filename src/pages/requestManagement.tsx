import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  MailOutline, 
  SendOutlined,
  MarkEmailReadOutlined,
  MarkEmailUnreadOutlined 
} from '@mui/icons-material';
import Navbar from '../components/navbar';
import ReceivedRequests from '../components/tripRequests/receivedRequests';
import SentRequests from '../components/tripRequests/sentRequests';
import postRequestService from '../redux/api/tripRequestService';
import { handleApiError } from '../redux/api/http-common';
import { toast } from 'react-toastify';
import { useAppSelector } from '../redux/store';

const RequestManagementPage = () => {

    const profile = useAppSelector(s=>s.profile.profile)

    const [viewMode, setViewMode] = useState('received');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [animation, setAnimation] = useState(true);
  // These would come from your API in production
  const [receivedRequests,setReceivedRequests] = useState([])
  const [sentRequests,setSentRequests] = useState([])
  const [refresh,setRefresh] = useState(false)

  useEffect(() => {
    postRequestService.getAllRequests()
      .then(response => {
        setSentRequests(response.data.filter(req=>req.from_profile.user.email === profile?.email))
        setReceivedRequests(response.data.filter(req=>req.from_profile.user.email !== profile?.email))
      })
      .catch(error => {
        handleApiError(error);
      });
  }, [refresh]);

  const handleAcceptRequest = async (id) => {
    postRequestService.acceptRequest(id)
      .then(res => {
        toast('Request Accepted Successfully. Notification Sent To User');
      })
      .catch(error => {
        console.log(error);
        toast("There was an error accepting request, please try later. Or contact Support");
      })
      .finally(() => {
        setRefresh(!refresh);
      });
  };

  const handleRejectRequest = async (id) => {
    postRequestService.rejectRequest(id)
      .then(res => {
        toast("Request Rejected. Notification Sent to User");
      })
      .catch(error => {
        console.log(error);
        toast("There was an error rejecting the request. Try again or contact support");
      })
      .finally(() => {
        setRefresh(!refresh);
      });
  };



  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      setAnimation(false);
      setTimeout(() => {
        setViewMode(newValue);
        setAnimation(true);
      }, 150);
    }
  };

  const TabIcon = ({ type }) => {
    if (type === 'received') {
      return viewMode === 'received' ? 
        <MarkEmailReadOutlined /> : 
        <MailOutline />;
    } else {
      return viewMode === 'sent' ? 
        <SendOutlined sx={{ transform: 'rotate(-45deg)' }} /> : 
        <SendOutlined />;
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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden',
            mb: 4
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              pb: 0,
              background: theme.palette.background.default
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Trip Requests Management
            </Typography>
            
            <Tabs
              value={viewMode}
              onChange={handleViewChange}
              variant={isMobile ? "fullWidth" : "standard"}
              sx={{
                '& .MuiTab-root': {
                  minHeight: '64px',
                  fontSize: '1rem',
                },
                '& .Mui-selected': {
                  fontWeight: 'bold',
                }
              }}
              TabIndicatorProps={{
                style: {
                  height: '3px'
                }
              }}
            >
              <Tab 
                value="received" 
                icon={isMobile ? <TabIcon type="received" /> : null}
                iconPosition="top"
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: isMobile ? 0.5 : 1.5,
                    py: 0.5
                  }}>
                    {!isMobile && <TabIcon type="received" />}
                    <Typography 
                      component="span" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Received Requests
                    </Typography>
                    <Badge 
                      badgeContent={receivedRequests.length} 
                      color="primary" 
                      sx={{ 
                        ml: 0.5,
                        '& .MuiBadge-badge': { 
                          fontSize: '0.8rem',
                          height: '22px',
                          minWidth: '22px',
                          padding: '0 6px'
                        } 
                      }}
                    />
                  </Box>
                }
                sx={{ 
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  borderBottom: viewMode === 'received' ? 
                    `1px solid ${theme.palette.divider}` : 
                    `1px solid transparent`
                }}
              />
              <Tab 
                value="sent" 
                icon={isMobile ? <TabIcon type="sent" /> : null}
                iconPosition="top"
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: isMobile ? 0.5 : 1.5,
                    py: 0.5
                  }}>
                    {!isMobile && <TabIcon type="sent" />}
                    <Typography 
                      component="span" 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      Sent Requests
                    </Typography>
                    <Badge 
                      badgeContent={sentRequests.length} 
                      color="primary"
                      sx={{ 
                        ml: 0.5,
                        '& .MuiBadge-badge': { 
                          fontSize: '0.8rem',
                          height: '22px',
                          minWidth: '22px',
                          padding: '0 6px'
                        } 
                      }}
                    />
                  </Box>
                }
                sx={{ 
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  borderBottom: viewMode === 'sent' ? 
                    `1px solid ${theme.palette.divider}` : 
                    `1px solid transparent`
                }}
              />
            </Tabs>
          </Box>

          <Divider />
          
          <Fade in={animation} timeout={300}>
            <Box sx={{ p: { xs: 1, md: 3 } }}>
              {viewMode === 'received' ? (
                <ReceivedRequests requests={receivedRequests} handleAcceptRequest={handleAcceptRequest}
                handleRejectRequest={handleRejectRequest}
                />
              ) : (
                <SentRequests requests={sentRequests} />
              )}
            </Box>
          </Fade>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Tooltip title="Need help with requests?">
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton size="small" color="primary">
                <MarkEmailUnreadOutlined fontSize="small" />
              </IconButton>
              Click on a request card to see details and available actions
            </Typography>
          </Tooltip>
        </Box>
      </Container>
    </>
  );
};

export default RequestManagementPage;