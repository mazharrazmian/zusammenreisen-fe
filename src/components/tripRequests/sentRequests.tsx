import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Tabs,
  Tab,
  Card,
  Avatar,
  Chip,
  Button,
  Stack,
  Badge,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Group,
  LocalActivity,
  MoreVert,
  EventAvailable,
  CreditCard,
  Chat,
  Delete,
  Edit
} from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../../redux/api/http-common';
import chatServices from '../../redux/api/chatServices';
import { getKeyByValue, REQUESTSTATUS } from '../../Constants';
import postRequestService from '../../redux/api/tripRequestService';



const SentRequests = ({requests}) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, requestId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(requestId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleCancelRequest = async (id) => {
    // This API endpoint needs to be created
    postRequestService.deleteRequest(id)
      .then(res => {
        //TODO : Delete the notification sent to user 
        // when the sent request is deleted
        toast('Request Canceled Successfully');
      })
      .catch(error => {
        console.log(error);
        toast("There was an error canceling the request, please try later. Or contact Support");
      })
      .finally(() => {
        setRefresh(!refresh);
      });
  };

  const handleChat = (email) => {
    console.log(email)
    chatServices.getChatRooms(email)
      .then(response => {
        if (response.data.length > 0) {
          navigate(`/chat/${response.data[0].id}`);
        }
        else {
          let chatData = {
            'second_participant': email
          };
          chatServices.createRoom(chatData)
            .then(response => {
              if (response?.status == 201) {
                navigate(`chat/${response.data.id}`);
              }
            })
            .catch(error => {
              handleApiError(error);
            });
        }
      });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Pending: { color: 'default', icon: <AccessTime fontSize="small" /> },
      Accepted: { color: 'primary', icon: <CheckCircle fontSize="small" /> },
      Rejected: { color: 'default', icon: <Cancel fontSize="small" /> }
    };

    status = getKeyByValue(REQUESTSTATUS, status);
    return (
      <Chip
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        size="small"
        color={statusConfig[status].color}
        icon={statusConfig[status].icon}
      />
    );
  };

  // Filter requests based on tab
  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === REQUESTSTATUS.Pending;
    if (tabValue === 1) return request.status === REQUESTSTATUS.Accepted;
    if (tabValue === 2) return request.status === REQUESTSTATUS.Rejected;
    return true;
  });

  return (
    <Grid container spacing={3}>
      {/* Main Content */}
      <Grid item xs={12} md={8}>
        <Card>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab
              label={`Pending (${requests.filter(r => r.status === REQUESTSTATUS.Pending).length})`}
              icon={<AccessTime />}
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              label={`Accepted (${requests.filter(r => r.status === REQUESTSTATUS.Accepted).length})`}
              icon={<CheckCircle />}
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              label={`Rejected (${requests.filter(r => r.status === REQUESTSTATUS.Rejected).length})`}
              icon={<Cancel />}
              iconPosition={isMobile ? "top" : "start"}
            />
          </Tabs>
          <Divider />

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <Grid item xs={12} key={request.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        position: 'relative',
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={2}>
                          <Badge
                            color="primary"
                            variant="dot"
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            invisible={false}
                          >
                            <Avatar
                              src={request.to_profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.to_profile.name)}&background=random`}
                              sx={{ width: 56, height: 56, mx: 'auto' }}
                            />
                          </Badge>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          <Typography variant="subtitle1">
                            Sent to: {request.to_profile.name}
                          </Typography>

                          <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                            <Chip
                              size="small"
                              icon={<EventAvailable fontSize="small" />}
                              label={request.trip.date_from}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              icon={<Group fontSize="small" />}
                              label={`${request.trip.group_size} seat${request.trip.group_size > 1 ? 's' : ''}`}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              icon={<CreditCard fontSize="small" />}
                              label={`$${request.trip.estimated_cost}`}
                              variant="outlined"
                            />
                          </Stack>

                          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalActivity fontSize="small" sx={{ mr: 0.5 }} />
                            {request.trip.title}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                          <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                            {getStatusChip(request.status)}
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, request.id)}
                            >
                              <MoreVert />
                            </IconButton>
                          </Stack>
                        </Grid>
                      </Grid>

                      {request.message && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Your message: "{request.message}"
                            </Typography>
                          </Box>
                        </>
                      )}

                      {request.status === REQUESTSTATUS.Pending && (
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<Edit />}
                            fullWidth
                          >
                            Edit Request
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            fullWidth
                            onClick={() => handleCancelRequest(String(request.id))}
                          >
                            Cancel Request
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Chat />}
                            fullWidth
                            onClick={() => handleChat(request.to_profile.user.email)}
                          >
                            Chat
                          </Button>
                        </Stack>
                      )}

                      {request.status === REQUESTSTATUS.Accepted && (
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={1} sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<Chat />}
                            fullWidth
                            onClick={() => handleChat(request.to_profile.user.email)}
                          >
                            Chat With Host
                          </Button>
                        </Stack>
                      )}
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No {tabValue === 0 ? 'pending' : tabValue === 1 ? 'accepted' : 'rejected'} sent requests found
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Card>
      </Grid>

      {/* Summary Sidebar */}
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sent Requests Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Pending</Typography>
                  <Typography variant="body1">
                    {requests.filter(r => r.status === REQUESTSTATUS.Pending).length}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    mt: 1,
                    height: 6,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      width: `${(requests.filter(r => r.status === REQUESTSTATUS.Pending).length / Math.max(requests.length, 1)) * 100}%`
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Accepted</Typography>
                  <Typography variant="body1">
                    {requests.filter(r => r.status === REQUESTSTATUS.Accepted).length}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    mt: 1,
                    height: 6,
                    bgcolor: 'action.hover',
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      width: `${(requests.filter(r => r.status === REQUESTSTATUS.Accepted).length / Math.max(requests.length, 1)) * 100}%`
                    }}
                  />
                </Box>
              </Box>
              
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Rejected</Typography>
                  <Typography variant="body1">
                    {requests.filter(r => r.status === REQUESTSTATUS.Rejected).length}
                  </Typography>
                </Stack>
                <Box 
                  sx={{ 
                    mt: 1, 
                    height: 6, 
                    bgcolor: 'action.hover', 
                    borderRadius: 1,
                    position: 'relative',
                  }} 
                >


<Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      bgcolor: 'primary.main', 
                      borderRadius: 1,
                      width: `${(requests.filter(r => r.status === REQUESTSTATUS.Rejected).length / Math.max(requests.length, 1)) * 100}%`
                    }} 
                  />
                </Box>
              </Box>
            </Stack>
          </Card>

          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Stack spacing={2}>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/create-request')}
              >
                Create New Request
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/browse-trips')}
              >
                Browse Available Trips
              </Button>
            </Stack>
          </Card>
        </Stack>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Host Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Message Host</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Trip Details</MenuItem>
        <Divider />
        {filteredRequests.find(r => r.id === selectedRequest)?.status === REQUESTSTATUS.Pending && (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            Cancel Request
          </MenuItem>
        )}
      </Menu>
    </Grid>
  );
};

export default SentRequests;