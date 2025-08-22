// src/pages/onboarding/ProfileCompletionScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack,
  LinearProgress,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Wc,
  Cake,
  Language,
  ArrowBack
} from '@mui/icons-material';
import LanguageSelector from '../../components/language';
import authServices from '../../redux/api/authService';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../redux/store';
import { useTranslation } from 'react-i18next';

interface ProfileCompletionData {
  gender: string;
  age: number;
}

interface ProfileCompletionScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProfileCompletionScreen: React.FC<ProfileCompletionScreenProps> = ({ 
  onComplete,
  onBack 
}) => {
  const { t } = useTranslation('onboarding');
  const profile = useAppSelector((s) => s.profile);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [allLanguages, setAllLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [profileData, setProfileData] = useState<ProfileCompletionData>({
    gender: '',
    age: 25,
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    authServices.getAllLanguages().then(response => {
      setAllLanguages(response?.data);
    });
  }, []);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!profileData.gender) {
          newErrors.gender = t('genderError');
        }
        break;
      case 2:
        if (profileData.age < 18 || profileData.age > 100) {
          newErrors.age = t('ageError');
        }
        break;
      case 3:
        if (selectedLanguages.length === 0) {
          newErrors.languages = t('languageError');
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateProfileField = useCallback((field: keyof ProfileCompletionData, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleComplete = async () => {
    if (!validateCurrentStep()) return;
    if (!profile?.profile?.profile?.id) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('gender', profileData.gender);
      formData.append('age', profileData.age.toString());
      
      // Handle languages like in register page
      selectedLanguages.forEach((language) => {
        formData.append('languages', language.name);
      });

      await authServices.updateProfile(profile.profile.profile.id, formData);
      
      toast.success(t('profileCompletedSuccess'));
      onComplete();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || t('profileCompletedError');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Stack spacing={4} alignItems="center">
            <Box sx={{ textAlign: 'center' }}>
              <Wc sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="600">
                {t('genderTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                {t('genderDesc')}
              </Typography>
            </Box>

            <FormControl component="fieldset" error={!!errors.gender}>
              <RadioGroup
                value={profileData.gender}
                onChange={(e) => updateProfileField('gender', e.target.value)}
                row
                sx={{ gap: 3 }}
              >
                <FormControlLabel value="1" control={<Radio />} label={t('genderMale')} />
                <FormControlLabel value="2" control={<Radio />} label={t('genderFemale')} />
                <FormControlLabel value="3" control={<Radio />} label={t('genderOther')} />
              </RadioGroup>
              {errors.gender && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.gender}
                </Alert>
              )}
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={4} alignItems="center">
            <Box sx={{ textAlign: 'center' }}>
              <Cake sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="600">
                {t('ageTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                {t('ageDesc')}
              </Typography>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 300 }}>
              <Typography variant="body1" sx={{ mb: 2, textAlign: 'center' }}>
                {t('selectAge')}
              </Typography>
              <TextField
                select
                fullWidth
                value={profileData.age}
                onChange={(e) => updateProfileField('age', parseInt(e.target.value))}
                error={!!errors.age}
                helperText={errors.age}
              >
                {Array.from({ length: 83 }, (_, i) => i + 18).map(age => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={4} alignItems="center">
            <Box sx={{ textAlign: 'center' }}>
              <Language sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom fontWeight="600">
                {t('languageTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                {t('languageDesc')}
              </Typography>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 500 }}>
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                allLanguages={allLanguages}
                onLanguagesChange={setSelectedLanguages}
                disablePortal={true}
              />
              {errors.languages && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errors.languages}
                </Alert>
              )}
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 6 }}>
        <Stack spacing={4}>
          {/* Progress Bar */}
          <Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('profileStep', { currentStep, totalSteps })}
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ textAlign: 'center', mt: 2, fontWeight: 600 }}>
              {t('profileTitle')}
            </Typography>
          </Box>

          {/* Step Content */}
          <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center' }}>
            {renderStepContent()}
          </Box>

          {/* Navigation Buttons */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              startIcon={<ArrowBack />}
              onClick={currentStep === 1 ? onBack : handleBackStep}
              disabled={loading}
              variant="outlined"
            >
              {currentStep === 1 ? t('backToWelcome') : t('previous')}
            </Button>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : currentStep === totalSteps ? (
                t('completeProfile')
              ) : (
                t('continue')
              )}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ProfileCompletionScreen;