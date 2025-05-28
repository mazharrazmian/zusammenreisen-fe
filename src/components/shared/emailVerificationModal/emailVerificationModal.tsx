import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { CheckCircle, Email, Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const EmailVerificationModal = ({ open, onClose, onConfirm, userEmail }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const { t } = useTranslation('register');
  

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CheckCircle color="success" sx={{ fontSize: 48 }} />
          <Typography variant="h5" component="h2" fontWeight="bold">
            {t('registrationSuccessful')}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', px: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Email color="primary" sx={{ fontSize: 40 }} />
          
          <Typography variant="body1" color="text.primary">
            {t('VerificationEmailSent')}
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            {userEmail}
          </Typography>
          
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>{t('important')}</strong> {t('emailVerificationInstructions')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          sx={{ minWidth: 120 }}
        >
          OK!
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default EmailVerificationModal;