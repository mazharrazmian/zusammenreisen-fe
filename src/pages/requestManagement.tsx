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
  Tooltip,
  Skeleton
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
import { REQUESTSTATUS } from '../Constants';
import { useTranslation } from 'react-i18next';

const RequestManagementPage = () => {
    const profile = useAppSelector(s=>s.profile.profile)
    const [viewMode, setViewMode] = useState('received');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [animation, setAnimation] = useState(true);
    const [receivedRequests, setReceivedRequests] = useState([])
    const [sentRequests, setSentRequests] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(true)
    const { t } = useTranslation('requestmanagement');

    useEffect(() => {
        if (profile === null) return
        
        setLoading(true);
        
        postRequestService.getAllRequests()
          .then(response => {
            setSentRequests(
                response.data.filter(req => req.from_profile.user.email === profile?.email)
            );

            setReceivedRequests(
                response.data.filter(req => req.to_profile.user.email === profile?.email)
            );
        })
          .catch(error => {
            handleApiError(error);
          })
          .finally(() => {
            setLoading(false)
          })
    }, [refresh, profile]);

    const handleAcceptRequest = async (id) => {
        postRequestService.acceptRequest(id)
          .then(res => {
            toast(t('requestAccepted'));
          })
          .catch(error => {
            console.log(error);
            toast(t('errorAcceptingRequest'));
          })
          .finally(() => {
            setRefresh(!refresh);
          });
    };

    const handleRejectRequest = async (id) => {
        postRequestService.rejectRequest(id)
          .then(res => {
            toast(t('requestRejected'));
          })
          .catch(error => {
            console.log(error);
            toast(t('errorRejectingRequest'));
          })
          .finally(() => {
            setRefresh(!refresh);
          });
    };

    const handleRequestDelete = (id) => {
        postRequestService.deleteRequest(id)
        .then(res => {
            toast(t('requestDeleted'))
        })
        .catch(err => {
            toast(t('errorDeletingRequest'))
        })
        .finally(() => setRefresh(!refresh))
    }

    // New handler specifically for sent requests with immediate UI update
    const handleSentRequestDelete = async (id) => {
        // Optimistically remove the request immediately
        const originalRequests = sentRequests;
        const updatedRequests = sentRequests.filter(request => request.id !== id);
        setSentRequests(updatedRequests);

        try {
            await postRequestService.deleteRequest(id);
            toast(t('requestDeleted'));
        } catch (error) {
            // Rollback on error
            setSentRequests(originalRequests);
            console.log(error);
            toast(t('errorDeletingRequest'));
        }
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
          {loading ? (
                <Box sx={{ display: 'flex', mb: 3 }}>
                    <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                    <Box width="100%">
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="60%" />
                    </Box>
                </Box>
            ) : (
            <Container maxWidth="xl" sx={{ mb: 8 }}>
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
                      {t('tripRequestsManagement')}
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
                              {t('receivedRequests')}
                            </Typography>
                            <Badge 
                              badgeContent={receivedRequests.filter((f)=>{
                               return f.status === REQUESTSTATUS.Pending
                              }).length} 
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
                              {t('sentRequests')}
                            </Typography>
                            <Badge 
                              badgeContent={sentRequests.filter((f)=>{
                                return f.status === REQUESTSTATUS.Pending
                              }).length} 
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
                        <ReceivedRequests 
                            requests={receivedRequests} 
                            handleAcceptRequest={handleAcceptRequest}
                            handleRejectRequest={handleRejectRequest}
                            handleRequestDelete={handleRequestDelete}
                        />
                      ) : (
                        <SentRequests 
                          requests={sentRequests} 
                          onRequestDelete={handleSentRequestDelete}
                        />
                      )}
                    </Box>
                  </Fade>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Tooltip title={t('helpTooltip')}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton size="small" color="primary">
                        <MarkEmailUnreadOutlined fontSize="small" />
                      </IconButton>
                      {t('clickRequestCard')}
                    </Typography>
                  </Tooltip>
                </Box>
            </Container>
            )}
        </>
    );
};

export default RequestManagementPage;