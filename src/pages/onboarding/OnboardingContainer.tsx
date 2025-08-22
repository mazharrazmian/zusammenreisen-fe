// src/pages/onboarding/OnboardingContainer.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import ProfileCompletionScreen from './ProfileCompletionScreen';
import { useAppSelector } from '../../redux/store';
import authServices from '../../redux/api/authService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface OnboardingContainerProps {
  onComplete: () => void;
}

const OnboardingContainer: React.FC<OnboardingContainerProps> = ({ onComplete }) => {
  const { t } = useTranslation('onboarding');
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'completion'>('welcome');
  const profile = useAppSelector((s) => s.profile);

  const handleStartProfileCompletion = () => {
    setCurrentScreen('completion');
  };

  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  const handleComplete = async () => {
    try {
      // Refresh the profile to get updated data
      await authServices.getProfile();
      toast.success(t('onboardingToastSuccess'));
      onComplete();
    } catch (error) {
      console.error('Error refreshing profile:', error);
      onComplete(); // Still proceed even if refresh fails
    }
  };

  const userName = profile?.profile?.name || 'there';

  if (currentScreen === 'welcome') {
    return (
      <WelcomeScreen
        userName={userName}
        onStartProfileCompletion={handleStartProfileCompletion}
      />
    );
  }

  return (
    <ProfileCompletionScreen
      onComplete={handleComplete}
      onBack={handleBackToWelcome}
    />
  );
};

export default OnboardingContainer;