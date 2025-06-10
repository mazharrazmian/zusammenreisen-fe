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
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import chatServices from '../../redux/api/chatServices';
import { useTranslation } from 'react-i18next';


const NotificationPreferences = () => {
    
    const { t } = useTranslation('accountpage');
  
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
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

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleToggle = async (type, category) => {
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
      showSnackbar(`${notificationTypes[type].name} ${category} notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating preference:', error);
      showSnackbar('Error updating preference', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleFrequencyChange = async (event) => {
    const newFrequency = event.target.value;
    
    try {
      setSaving(true);
      const updatedPreferences = {
        ...preferences,
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

  const bulkToggle = async (category, enabled) => {
    if (!preferences) return;

    try {
      setSaving(true);
      const updates = {};
      
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
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!preferences) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load notification preferences</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('notificationPreferences')}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          {t('notificationPreferencesDesc')}
        </Typography>

        {/* Email Frequency Setting */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">{t('emailFrequency')}</Typography>
            </Box>
            <FormControl fullWidth>
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
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{t('emailNotifications')}</Typography>
                {preferences.email_frequency === 'disabled' && (
                  <Chip label={t('disabled')} size="small" sx={{ ml: 2 }} />
                )}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'inline' }}>
                  {t('quickActions')}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', mr: 1, display: 'inline' }}
                  onClick={() => bulkToggle('email', true)}
                >
                  {t('enableAll')}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', display: 'inline' }}
                  onClick={() => bulkToggle('email', false)}
                >
                  {t('disableAll')}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {Object.entries(notificationTypes).map(([key, config]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences[`${key}_email`]}
                        onChange={() => handleToggle(key, 'email')}
                        disabled={saving || preferences.email_frequency === 'disabled'}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {config.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">{t('pushNotifications')}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2, display: 'inline' }}>
                  {t('quickActions')}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', mr: 1, display: 'inline' }}
                  onClick={() => bulkToggle('push', true)}
                >
                  {t('enableAll')}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ cursor: 'pointer', display: 'inline' }}
                  onClick={() => bulkToggle('push', false)}
                >
                  {t('disableAll')}
                </Typography>
              </Box>
            </Box>
            
            <Grid container spacing={2}>
              {Object.entries(notificationTypes).map(([key, config]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences[`${key}_push`]}
                        onChange={() => handleToggle(key, 'push')}
                        disabled={saving}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {config.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Loading indicator */}
        {saving && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationPreferences;