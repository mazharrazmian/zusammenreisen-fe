import React, { useState, useEffect } from 'react';
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
  Skeleton,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ParticipantsSection = React.memo(({ participants, loading }) => {
    const { t } = useTranslation('tripPlannerDetail');

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
                {t('participants', { count: participants?.length || 0 })}
            </Typography>

            {loading ? (
                <Typography>{t('loading')}</Typography>
            ) : participants?.length > 0 ? (
                <List disablePadding>
                    {participants.map((participant) => (
                        <ListItem key={participant.id} disablePadding divider>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt={participant.user.name} src={participant.picture} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={participant.user.name}
                                    secondary={participant.languages.map((lang) => lang.name).join(', ')}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography>{t('noParticipants')}</Typography>
            )}
        </Paper>
    );
});

export default ParticipantsSection;