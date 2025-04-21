import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  ListItemButton,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import {tripService} from '../../redux/api/tripPlanningService';

const ParticipantsSection = React.memo(({ 
  participants, 
  loading, 
  tripId, 
  onParticipantRemoved, 
  currentUserId, // To identify the current user and disable self-removal
  postedBy, // Only show remove button if current user is the one who posted the trip
}) => {
    const { t } = useTranslation('tripdetails');
    const [removingId, setRemovingId] = useState(null); // Track which participant is being removed
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [participantToRemove, setParticipantToRemove] = useState(null);

    const handleRemoveClick = (participant) => {
        setParticipantToRemove(participant);
        setOpenConfirmDialog(true);
    };

    const handleConfirmRemove = async () => {
        if (!participantToRemove) return;
        
        setRemovingId(participantToRemove.id);
        setOpenConfirmDialog(false);
        
        try {
            await tripService.removeTripParticipant(tripId, participantToRemove.id);
            // Notify parent component to update participants list
            if (onParticipantRemoved) {
                onParticipantRemoved(participantToRemove.id);
            }
        } catch (error) {
            console.error('Failed to remove participant:', error);
            // Here you could add error handling, like showing a snackbar
        } finally {
            setRemovingId(null);
        }
    };

    const handleCancelRemove = () => {
        setOpenConfirmDialog(false);
        setParticipantToRemove(null);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
                {t('participants')}: {participants?.length || 0}
            </Typography>

            {loading ? (
                <Typography>{t('loading')}</Typography>
            ) : participants?.length > 0 ? (
                <List disablePadding>
                    {participants.map((participant) => {
                        const isCurrentUser = participant.id === currentUserId;
                        const isRemoving = removingId === participant.id;
                        const isOwner = currentUserId === postedBy;
                        return (
                            <ListItem 
                                key={participant.id} 
                                disablePadding 
                                divider
                                secondaryAction={
                                    !isCurrentUser && isOwner && (
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete"
                                            disabled={isRemoving}
                                            onClick={() => handleRemoveClick(participant)}
                                        >
                                            {isRemoving ? 
                                                <CircularProgress size={24} /> : 
                                                <DeleteIcon />
                                            }
                                        </IconButton>
                                    )
                                }
                            >
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Avatar alt={participant.user.name} src={participant.picture} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {participant.user.name}
                                                {isCurrentUser && (
                                                    <Chip label={t('you')} size="small" color="primary" />
                                                )}
                                            </Box>
                                        }
                                        secondary={participant.languages.map((lang) => lang.name).join(', ')}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography>{t('noParticipants')}</Typography>
            )}

            {/* Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCancelRemove}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('removeParticipantTitle', { defaultValue: 'Remove Participant' })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('removeParticipantConfirmation', { 
                            defaultValue: 'Are you sure you want to remove {{name}} from this trip?',
                            name: participantToRemove?.user?.name || ''
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelRemove} color="primary">
                        {t('cancel', { defaultValue: 'Cancel' })}
                    </Button>
                    <Button onClick={handleConfirmRemove} color="error" autoFocus>
                        {t('remove', { defaultValue: 'Remove' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
});

export default ParticipantsSection;