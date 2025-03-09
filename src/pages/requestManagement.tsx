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
  Box
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Group,
  LocalActivity,
  MoreVert,
  EventAvailable,
  CreditCard
} from '@mui/icons-material';
import Navbar from '../components/navbar';
import postRequestService from '../redux/api/tripRequestService';
import { handleApiError } from '../redux/api/http-common';


const RequestManagementTab = () => {
  const [requests,setRequests ] = useState([])
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

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

  useEffect(()=>{

    postRequestService.getAllRequests()
    .then(response=>{
        setRequests(response.data)
    })
    .catch(error=>{
        handleApiError(error)
    })
  },[])

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: 'default', icon: <AccessTime fontSize="small" /> },
      accepted: { color: 'primary', icon: <CheckCircle fontSize="small" /> },
      rejected: { color: 'default', icon: <Cancel fontSize="small" /> }
    };

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
    if (tabValue === 0) return request.status === 'pending';
    if (tabValue === 1) return request.status === 'accepted';
    if (tabValue === 2) return request.status === 'rejected';
    return true;
  });

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


    <Box sx={{ p: 3 }}>
       
      <Grid container spacing={3}>
        {/* Header Section */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            post Requests
            <Chip 
              label={`${requests.filter(r => r.status === 'pending').length} Pending`} 
              color="primary" 
              size="small" 
              sx={{ ml: 1.5 }} 
            />
          </Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Card>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
            >
              <Tab 
                label={`Pending (${requests.filter(r => r.status === 'pending').length})`} 
                icon={<AccessTime />} 
                iconPosition="start" 
              />
              <Tab 
                label={`Accepted (${requests.filter(r => r.status === 'accepted').length})`} 
                icon={<CheckCircle />} 
                iconPosition="start" 
              />
              <Tab 
                label={`Rejected (${requests.filter(r => r.status === 'rejected').length})`} 
                icon={<Cancel />} 
                iconPosition="start" 
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
                          ...(request.priority === 'high' && {
                            borderLeft: '3px solid',
                            borderLeftColor: 'text.primary'
                          })
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
                                src={request.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user.name)}&background=random`} 
                                sx={{ width: 56, height: 56, mx: 'auto' }} 
                              />
                            </Badge>
                          </Grid>

                          <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle1">
                              {request.user.name}
                            </Typography>
                            
                            <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                              <Chip 
                                size="small" 
                                icon={<EventAvailable fontSize="small" />} 
                                label={request.post.date} 
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                icon={<Group fontSize="small" />} 
                                label={`${request.post.seats} seat${request.post.seats > 1 ? 's' : ''}`} 
                                variant="outlined"
                              />
                              <Chip 
                                size="small" 
                                icon={<CreditCard fontSize="small" />} 
                                label={`$${request.post.price}`} 
                                variant="outlined"
                              />
                            </Stack>
                            
                            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocalActivity fontSize="small" sx={{ mr: 0.5 }} />
                              {request.post.title}
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
                                "{request.message}"
                              </Typography>
                            </Box>
                          </>
                        )}

                        {request.status === 'pending' && (
                          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<CheckCircle />}
                              fullWidth
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outlined" 
                              startIcon={<Cancel />}
                              fullWidth
                            >
                              Reject
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
                        No {tabValue === 0 ? 'pending' : tabValue === 1 ? 'accepted' : 'rejected'} requests found
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
                Requests Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Pending</Typography>
                    <Typography variant="body1">
                      {requests.filter(r => r.status === 'pending').length}
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
                        width: `${(requests.filter(r => r.status === 'pending').length / requests.length) * 100}%`
                      }} 
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Accepted</Typography>
                    <Typography variant="body1">
                      {requests.filter(r => r.status === 'accepted').length}
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
                        width: `${(requests.filter(r => r.status === 'accepted').length / requests.length) * 100}%`
                      }} 
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Rejected</Typography>
                    <Typography variant="body1">
                      {requests.filter(r => r.status === 'rejected').length}
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
                        width: `${(requests.filter(r => r.status === 'rejected').length / requests.length) * 100}%`
                      }} 
                    />
                  </Box>
                </Box>
              </Stack>
            </Card>
            
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                High Priority Requests
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {requests.filter(r => r.priority === 'high').length > 0 ? (
                <Stack spacing={2}>
                  {requests
                    .filter(r => r.priority === 'high')
                    .map(request => (
                      <Box key={request.id} sx={{ 
                        p: 1.5, 
                        borderRadius: 1, 
                        bgcolor: 'action.hover',
                        borderLeft: '3px solid',
                        borderLeftColor: 'text.primary'
                      }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar 
                            src={request.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.user.name)}&background=random`} 
                            sx={{ width: 40, height: 40 }} 
                          />
                          <Box>
                            <Typography variant="body2">
                              {request.user.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.post.title} • {request.post.date}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))
                  }
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No high priority requests
                </Typography>
              )}
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Full Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Message User</MenuItem>
        <MenuItem onClick={handleMenuClose}>Check User History</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          Archive Request
        </MenuItem>
      </Menu>
    </Box>
    </>
  );
};

export default RequestManagementTab;