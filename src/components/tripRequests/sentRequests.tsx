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
import { useTranslation } from 'react-i18next';
import ClickableAvatar from '../shared/clickableAvatar/clicakableAvatar';

const SentRequests = ({requests}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('requestmanagement');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, request) => {
    setAnchorEl(event.currentTarget);
    setSelectedRequest(request);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRequest(null);
  };

  const handleCancelRequest = async (id) => {
    postRequestService.deleteRequest(id)
      .then(res => {
        toast(t('requestDeleted'));
      })
      .catch(error => {
        console.log(error);
        toast(t('errorDeletingRequest'));
      })
      .finally(() => {
        setRefresh(!refresh);
      });
  };

  const handleChat = (email) => {
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
                navigate(`/chat/${response.data.id}`);
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
        label={t(status.toLowerCase())}
        size="small"
        color={statusConfig[status].color}
        icon={statusConfig[status].icon}
      />
    );
  };

  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === REQUESTSTATUS.Pending;
    if (tabValue === 1) return request.status === REQUESTSTATUS.Accepted;
    if (tabValue === 2) return request.status === REQUESTSTATUS.Rejected;
    return true;
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab
              label={`${t('pendingRequests')} ${requests.filter(r => r.status === REQUESTSTATUS.Pending).length}` }
              icon={<AccessTime />}
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              label={`${t('acceptedRequests')} ${requests.filter(r => r.status === REQUESTSTATUS.Accepted).length}` }
              icon={<CheckCircle />}
              iconPosition={isMobile ? "top" : "start"}
            />
            <Tab
              label={`${t('rejectedRequests')} ${requests.filter(r => r.status === REQUESTSTATUS.Rejected).length}` }
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
                            <ClickableAvatar
                                src={request.to_profile.picture}
                                navigateTo={`/profile/${request?.to_profile?.id}`}
                                fallbackName={request.to_profile.name}
                            />
                            
                          </Badge>
                        </Grid>

                        <Grid item xs={12} sm={8}>
                          <Typography variant="subtitle1">
                            {t("sentTo")} {request.to_profile.user.name}
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
                              label={`${request.trip.group_size} ${t('seat', { count: request.trip.group_size })}`}
                              variant="outlined"
                            />
                            <Chip
                              size="small"
                              icon={<CreditCard fontSize="small" />}
                              label={`$${parseFloat(request.trip.estimated_cost).toFixed(2)}`}
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
                              onClick={(e) => handleMenuOpen(e, request)}
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
                                {request.message}
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
                            {t('editRequest')}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<Delete />}
                            fullWidth
                            onClick={() => handleCancelRequest(String(request.id))}
                          >
                            {t('cancelRequest')}
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<Chat />}
                            fullWidth
                            onClick={() => handleChat(request.to_profile.user.email)}
                          >
                            {t('chat')}
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
                            {t('chatWithHost')}
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
                      {t('noRequestsFound', { status: tabValue === 0 ? t('pending') : tabValue === 1 ? t('accepted') : t('rejected') })}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('sentRequestsSummary')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">{t('pending')}</Typography>
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
                  <Typography variant="body2">{t('accepted')}</Typography>
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
                  <Typography variant="body2">{t('rejected')}</Typography>
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

        </Stack>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={()=>navigate(`/profile/${selectedRequest?.to_profile?.id}`)}>{t('viewProfile')}</MenuItem>
        <MenuItem onClick={()=>console.log(selectedRequest)}>{t('viewTripDetails')}</MenuItem>

        <MenuItem onClick={()=>navigate(`/tripplanner/${selectedRequest?.trip.id}`)}>{t('viewTripDetails')}</MenuItem>
        <Divider />
        {filteredRequests.find(r => r.id === selectedRequest)?.status === REQUESTSTATUS.Pending && (
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            {t('cancelRequest')}
          </MenuItem>
        )}
      </Menu>
    </Grid>
  );
};

export default SentRequests;