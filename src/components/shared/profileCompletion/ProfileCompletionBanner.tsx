// components/ProfileCompletionBanner.tsx
import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  IconButton,
  Slide,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  AccountCircle as ProfileIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionBannerProps {
  isProfileCompleted: boolean;
  completionPercentage?: number;
  missingFields?: string[];
  onDismiss?: () => void;
  profileUrl?: string;
  showDismissButton?: boolean;
}

const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({
  isProfileCompleted,
  completionPercentage = 40,
  missingFields = ['age', 'gender', 'languages'],
  onDismiss,
  profileUrl = '/profile',
  showDismissButton = true,
}) => {
  // Initialize dismissed state from sessionStorage
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('profileBannerDismissed') === 'true';
  });
  
  const navigate = useNavigate();

  // Don't show banner if profile is completed or has been dismissed
  if (isProfileCompleted || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('profileBannerDismissed', 'true');
    onDismiss?.();
  };

  const handleCompleteProfile = () => {
    navigate(profileUrl);
  };

  const getMissingFieldsText = () => {
    if (missingFields.length === 0) return '';
    if (missingFields.length === 1) return missingFields[0];
    if (missingFields.length === 2) return missingFields.join(' and ');
    return `${missingFields.slice(0, -1).join(', ')} and ${missingFields[missingFields.length - 1]}`;
  };

  return (
    <Slide direction="down" in={!dismissed} mountOnEnter unmountOnExit>
      <Alert
        severity="info"
        sx={{
          borderRadius: 0,
          border: 'none',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #E8F5E9 100%)',
          borderBottom: '1px solid',
          borderBottomColor: 'info.light',
          py: { xs: 1, md: 2 },
          px: { xs: 1.5, md: 3 },
          '& .MuiAlert-icon': {
            color: 'info.main',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            mt: { xs: 0.25, md: 0 },
          },
          '& .MuiAlert-action': {
            pt: 0,
            pr: 0,
            pl: { xs: 1, md: 2 },
          },
        }}
        icon={<ProfileIcon />}
        action={
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            gap: { xs: 0.5, md: 1 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleCompleteProfile}
              startIcon={<EditIcon sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: { xs: 1.5, md: 2 },
                py: { xs: 0.5, md: 0.75 },
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                minHeight: { xs: '28px', md: '32px' },
                background: 'linear-gradient(45deg, #2A7F7E 0%, #2A4F7E 100%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1A5A5A 0%, #1A365A 100%)',
                },
              }}
            >
              Complete
            </Button>
            {showDismissButton && (
              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{
                  color: 'info.main',
                  p: { xs: 0.5, md: 1 },
                  '&:hover': {
                    backgroundColor: 'info.lighter',
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, md: 2 }, 
            mb: { xs: 0.5, md: 1 },
            flexWrap: 'wrap',
          }}>
            <AlertTitle sx={{ 
              m: 0, 
              fontWeight: 600, 
              color: 'info.dark',
              fontSize: { xs: '0.875rem', md: '1rem' },
            }}>
              Complete Your Profile
            </AlertTitle>
            <Chip
              label={`${completionPercentage}%`}
              size="small"
              sx={{
                backgroundColor: 'success.lighter',
                color: 'success.dark',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', md: '0.75rem' },
                height: { xs: '20px', md: '24px' },
              }}
            />
          </Box>
          
          <Typography
            variant="body2"
            sx={{
              color: 'info.dark',
              mb: { xs: 0.5, md: 1 },
              lineHeight: 1.4,
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              display: { xs: 'none', sm: 'block' }, // Hide detailed text on very small screens
            }}
          >
            Add your <strong>{getMissingFieldsText()}</strong> to get personalized tour recommendations.
          </Typography>

          {/* Simplified mobile text */}
          <Typography
            variant="body2"
            sx={{
              color: 'info.dark',
              mb: { xs: 0.5, md: 1 },
              lineHeight: 1.4,
              fontSize: '0.75rem',
              display: { xs: 'block', sm: 'none' }, // Show only on very small screens
            }}
          >
            Add missing details for better recommendations.
          </Typography>

          {/* Progress Bar */}
          <Box sx={{ mt: { xs: 0.75, md: 1.5 } }}>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{
                height: { xs: 4, md: 6 },
                borderRadius: 3,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #66BB6A 0%, #2A7F7E 100%)',
                },
              }}
            />
          </Box>
        </Box>
      </Alert>
    </Slide>
  );
};

export default ProfileCompletionBanner;