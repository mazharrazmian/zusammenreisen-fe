import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import chatServices from '../../redux/api/chatServices';
import { useTranslation } from 'react-i18next';

interface NotificationPreferences {
  email_frequency: string;
  [key: string]: any;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

const NotificationPreferences: React.FC = () => {
  const { t } = useTranslation('accountpage');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Notification types with their display names and descriptions
  const notificationTypes = {
    trip_request: {
      name: t('tripRequests'),
      description: t('tripRequestsDesc')
    },
    request_accepted: {
      name: t('requestAccepted'),
      description: t('requestAcceptedDesc')
    },
    request_rejected: {
      name: t('requestRejected'),
      description: t('requestRejectedDesc')
    },
    new_message: {
      name: t('newMessages'),
      description: t('newMessagesDesc')
    },
    trip_reminder: {
      name: t('tripReminders'),
      description: t('tripRemindersDesc')
    },
    profile_update: {
      name: t('profileUpdates'),
      description: t('profileUpdatesDesc')
    },
    system_announcement: {
      name: t('systemAnnouncements'),
      description: t('systemAnnouncementsDesc')
    }
  };

  const emailFrequencyOptions = [
    { value: 'immediate', label: t('immediate') },
    { value: 'daily', label: t('dailyDigest') },
    { value: 'weekly', label: t('weeklyDigest') },
    { value: 'disabled', label: t('disabled') }
  ];

  // Fetch preferences on component mount
  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await chatServices.getNotificationPreferences();
      if (response.status === 200) {
        setPreferences(response.data);
      } else {
        throw new Error('Failed to fetch preferences');
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      showSnackbar('Error loading preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleToggle = async (type: string, category: string) => {
    if (!preferences) return;

    const fieldName = `${type}_${category}`;
    const newValue = !preferences[fieldName];
    
    try {
      setSaving(true);
      const updatedPreferences = {
        ...preferences,
        [fieldName]: newValue
      };
      
      await chatServices.updateNotificationPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
      showSnackbar(`${notificationTypes[type as keyof typeof notificationTypes].name} ${category} notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating preference:', error);
      showSnackbar('Error updating preference', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = async (event: { target: { value: string } }) => {
    const newFrequency = event.target.value;
    
    try {
      setSaving(true);
      const updatedPreferences = {
        ...preferences!,
        email_frequency: newFrequency
      };
      
      await chatServices.updateNotificationPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
      showSnackbar(`Email frequency updated to ${emailFrequencyOptions.find(opt => opt.value === newFrequency)?.label}`);
    } catch (error) {
      console.error('Error updating frequency:', error);
      showSnackbar('Error updating email frequency', 'error');
    } finally {
      setSaving(false);
    }
  };

  const bulkToggle = async (category: string, enabled: boolean) => {
    if (!preferences) return;

    try {
      setSaving(true);
      const updates: Record<string, boolean> = {};
      
      Object.keys(notificationTypes).forEach(type => {
        updates[`${type}_${category}`] = enabled;
      });

      const updatedPreferences = {
        ...preferences,
        ...updates
      };

      await chatServices.updateNotificationPreferences(updatedPreferences);
      setPreferences(updatedPreferences);
      showSnackbar(`All ${category} notifications ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error bulk updating preferences:', error);
      showSnackbar('Error updating preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ 
        py: { xs: 2, sm: 4 }, 
        px: { xs: 1, sm: 2 },
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!preferences) {
    return (
      <Container maxWidth="md" sx={{ 
        py: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 }
      }}>
        <Alert severity="error">Failed to load notification preferences</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ 
      py: { xs: 2, sm: 4 },
      px: { xs: 1, sm: 2 }
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: { xs: 2, sm: 3 },
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' },
          gap: { xs: 1, sm: 0 }
        }}>
          <SettingsIcon sx={{ 
            mr: { xs: 0, sm: 2 }, 
            fontSize: { xs: 28, sm: 32 }, 
            color: 'primary.main' 
          }} />
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            {t('notificationPreferences')}
          </Typography>
        </Box>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          paragraph
          sx={{ 
            fontSize: { xs: '0.875rem', sm: '1rem' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          {t('notificationPreferencesDesc')}
        </Typography>

        {/* Email Frequency Setting */}
        <Card sx={{ 
          mb: { xs: 2, sm: 4 },
          borderRadius: { xs: 2, sm: 3 }
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 0 }
            }}>
              <EmailIcon sx={{ 
                mr: { xs: 0, sm: 1 }, 
                color: 'primary.main',
                fontSize: { xs: 20, sm: 24 }
              }} />
              <Typography 
                variant="h6"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {t('emailFrequency')}
              </Typography>
            </Box>
            <FormControl 
              fullWidth 
              size={isMobile ? "small" : "medium"}
            >
              <InputLabel>{t('emailFrequencyLabel')}</InputLabel>
              <Select
                data-testid="email-frequency-select"
                value={preferences.email_frequency}
                onChange={handleFrequencyChange}
                disabled={saving}
                label={t('emailFrequencyLabel')}
              >
                {emailFrequencyOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card sx={{ 
          mb: { xs: 2, sm: 4 },
          borderRadius: { xs: 2, sm: 3 }
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <EmailIcon sx={{ 
                  color: 'primary.main',
                  fontSize: { xs: 20, sm: 24 }
                }} />
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {t('emailNotifications')}
                </Typography>
                {preferences.email_frequency === 'disabled' && (
                  <Chip 
                    label={t('disabled')} 
                    size="small" 
                    sx={{ ml: { xs: 0, sm: 2 } }} 
                  />
                )}
              </Box>
              
              {/* Quick Actions */}
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'inline' }
                  }}
                >
                  {t('quickActions')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => bulkToggle('email', true)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: 'auto',
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {t('enableAll')}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => bulkToggle('email', false)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: 'auto',
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {t('disableAll')}
                  </Button>
                </Box>
              </Box>
            </Box>
            
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {Object.entries(notificationTypes).map(([key, config]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        size={isMobile ? "small" : "medium"}
                        checked={preferences[`${key}_email`]}
                        onChange={() => handleToggle(key, 'email')}
                        disabled={saving || preferences.email_frequency === 'disabled'}
                      />
                    }
                    label={
                      <Box>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                        >
                          {config.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.75rem' },
                            display: 'block'
                          }}
                        >
                          {config.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      alignItems: 'flex-start',
                      '& .MuiFormControlLabel-label': {
                        mt: { xs: 0.5, sm: 0 }
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card sx={{ borderRadius: { xs: 2, sm: 3 } }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <NotificationsIcon sx={{ 
                  color: 'primary.main',
                  fontSize: { xs: 20, sm: 24 }
                }} />
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {t('pushNotifications')}
                </Typography>
              </Box>
              
              {/* Quick Actions */}
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 1
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    display: { xs: 'none', sm: 'inline' }
                  }}
                >
                  {t('quickActions')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => bulkToggle('push', true)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: 'auto',
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {t('enableAll')}
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => bulkToggle('push', false)}
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      minWidth: 'auto',
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    {t('disableAll')}
                  </Button>
                </Box>
              </Box>
            </Box>
            
            <Grid container spacing={{ xs: 1, sm: 2 }}>
              {Object.entries(notificationTypes).map(([key, config]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        size={isMobile ? "small" : "medium"}
                        checked={preferences[`${key}_push`]}
                        onChange={() => handleToggle(key, 'push')}
                        disabled={saving}
                      />
                    }
                    label={
                      <Box>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                        >
                          {config.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.75rem' },
                            display: 'block'
                          }}
                        >
                          {config.description}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      alignItems: 'flex-start',
                      '& .MuiFormControlLabel-label': {
                        mt: { xs: 0.5, sm: 0 }
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        {saving && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: { xs: 1, sm: 2 } 
          }}>
            <CircularProgress size={isMobile ? 20 : 24} />
          </Box>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ 
          vertical: 'bottom', 
          horizontal: isMobile ? 'center' : 'left' 
        }}
        sx={{
          '& .MuiSnackbarContent-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }
        }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={handleCloseSnackbar}
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationPreferences;