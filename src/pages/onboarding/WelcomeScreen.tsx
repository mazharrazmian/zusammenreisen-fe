// src/pages/onboarding/WelcomeScreen.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Stack
} from '@mui/material';
import {
  Celebration,
  People,
  LocationOn,
  Security
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface WelcomeScreenProps {
  userName: string;
  onStartProfileCompletion: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  userName, 
  onStartProfileCompletion 
}) => {
  const { t } = useTranslation('onboarding');
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <Stack spacing={4} alignItems="center">
          {/* Header */}
          <Box>
            <Celebration sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold">
              {t('welcomeTitle')}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight="600">
              {t('welcomeHi', { userName })}
            </Typography>
          </Box>

          {/* Description */}
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            {t('welcomeDesc')}
          </Typography>

          {/* Features */}
          <Stack spacing={3} sx={{ width: '100%', maxWidth: 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <People sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="body1">
                {t('featureConnect')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="body1">
                {t('featureDiscover')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Security sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant="body1">
                {t('featureSafe')}
              </Typography>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {t('quickProcess')}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onStartProfileCompletion}
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              fontWeight: 600 
            }}
          >
            {t('completeProfileBtn')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default WelcomeScreen;