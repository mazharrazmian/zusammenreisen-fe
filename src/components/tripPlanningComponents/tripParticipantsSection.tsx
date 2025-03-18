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
import { Language, Wc, Cake } from '@mui/icons-material';

const ParticipantsSection = React.memo(({participants,loading})=>{

    const getGenderText = (genderCode) => {
      switch(genderCode) {
        case 1: return "Male";
        case 2: return "Female";
        case 3: return "Other";
        default: return "Not specified";
      }
    };
  
    const handleProfileClick = (userId) => {
      // In a real app, this would navigate to the user's profile
      console.log(`Navigate to profile of user ${userId}`);
      alert(`Navigating to profile of user ${userId}`);
    };
  
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Participants ({participants?.length})
        </Typography>
  
        {loading ? (
          // Loading skeletons
          Array.from(new Array(3)).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', my: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box width="100%">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))
        ) : (
          <List disablePadding>
            {participants?.map((participant) => (
              <ListItem 
                key={participant.id} 
                disablePadding 
                divider
                sx={{ py: 1 }}
              >
                <ListItemButton onClick={() => handleProfileClick(participant.id)}>
                  <ListItemAvatar>
                    <Avatar 
                      alt={participant.user.name} 
                      src={participant.picture}
                      sx={{ width: 50, height: 50 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="medium">
                        {participant.user.name}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Wc fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            {getGenderText(participant.gender)}
                          </Typography>
                          
                          <Cake fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {participant.age} years
                          </Typography>
                        </Box>
                        
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Language fontSize="small" sx={{ mr: 0.5, fontSize: '0.875rem', color: 'text.secondary' }} />
                          <Box>
                            {participant.languages.map((lang, i) => (
                              <Chip 
                                key={i} 
                                label={lang.name} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5, height: 20, fontSize: '0.7rem' }} 
                              />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    );

})  

   


export default ParticipantsSection;