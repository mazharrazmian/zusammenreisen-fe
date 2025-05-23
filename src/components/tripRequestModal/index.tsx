import React, { useState } from 'react';
import { 
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid2 as Grid,
  Modal,
  TextField,
  Typography 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import postRequestService from '../../redux/api/tripRequestService';
import { toast } from 'react-toastify';
import { handleApiError } from '../../redux/api/http-common';
import { useAppSelector } from '../../redux/store';
import { REQUESTSTATUS } from '../../Constants';
import { useTranslation } from 'react-i18next';

const JoinTripRequestModal = ({ open, handleClose, tripDetails }) => {
    const { t } = useTranslation('tripdetails');
    const profile = useAppSelector(s=>s.profile)
  const [formData, setFormData] = useState({
    message : '',
    from_email : profile?.profile?.email,
    status : REQUESTSTATUS['Pending'],
    post : tripDetails.id,
    to_profile_id : tripDetails.posted_by?.id
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the request to your backend
    postRequestService.createRequest(formData)
    .then(response=>{
        if (response.status == 201){
            toast.success(t('requestSentSuccess'));
        }
        else {
            toast.error(t('requestFailed')); 
        }
        handleClose(true); // Close with success flag
    })
    .catch(error=>{
        handleApiError(error)
        return
    })
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
    maxWidth: '800px',
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Modal
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="join-trip-modal-title"
    >
      <Box sx={modalStyle}>
        {/* Modal Header */}
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid', 
          borderColor: 'divider' 
        }}>
          <Typography id="join-trip-modal-title" variant="h6" component="h2">
            {t('join')} "{tripDetails?.title}"
          </Typography>
          <Button 
            onClick={() => handleClose(false)} 
            sx={{ minWidth: '40px', p: 0 }}
          >
            <CloseIcon />
          </Button>
        </Box>

        {/* Modal Content */}
        <Box sx={{ p: 3, overflowY: 'auto' }}>
          {/* Trip Details Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
              {t("tripDetails")}
            </Typography>
            <Box sx={{ 
              bgcolor: 'background.default', 
              p: 2, 
              borderRadius: 1 
            }}>
              <Grid container spacing={2}>
                <Grid size={{xs:12,sm:6}}>
                  <Typography variant="body2" color="text.secondary">{t('destination')}:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {tripDetails?.travel_to_city.name}, {tripDetails?.travel_to_country.name}
                  </Typography>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                  <Typography variant="body2" color="text.secondary">{t('dates')}:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {tripDetails?.date_from} - {tripDetails?.date_to}
                  </Typography>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                  <Typography variant="body2" color="text.secondary">{t('type')}:</Typography>
                  <Typography variant="body2" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                    {tripDetails?.tour_type}
                  </Typography>
                </Grid>
                <Grid size={{xs:12,sm:6}}>
                  <Typography variant="body2" color="text.secondary">{t('groupSize')}:</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {tripDetails?.current_travellers}/{tripDetails?.group_size}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
            {t("aboutYourself")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t("tripOrganizerReview")}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{xs:12}}>
                <TextField
                  name="message"
                  label={t('writeMessage')}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder={t("messagePlaceholder")}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Grid>

              
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => handleClose(false)}
              >
                {t("cancel")}
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
              >
                {t("sendRequest")}
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default JoinTripRequestModal;