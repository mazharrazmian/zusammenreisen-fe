import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ParticipantsList = ({ participants }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedParticipant, setSelectedParticipant] = React.useState(null);

  const handleMenuOpen = (event, participant) => {
    setAnchorEl(event.currentTarget);
    setSelectedParticipant(participant);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedParticipant(null);
  };

  const handleInvite = () => {
    // Implementation for inviting new participants
    console.log('Invite new participants');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Participants ({participants.length})
        </Typography>
        <Tooltip title="Invite participants">
          <IconButton color="primary" onClick={handleInvite}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <List sx={{ bgcolor: 'background.paper' }}>
        {participants.map((participant) => (
          <ListItem
            key={participant.id}
            secondaryAction={
              <Tooltip title="More options">
                <IconButton 
                  edge="end" 
                  aria-label="more" 
                  onClick={(e) => handleMenuOpen(e, participant)}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemAvatar>
              <Avatar alt={participant.name} src={participant.avatar} />
            </ListItemAvatar>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" component="span">
                    {participant.name}
                  </Typography>
                  
                  {participant.isOwner && (
                    <Chip 
                      label="Organizer" 
                      size="small" 
                      color="secondary" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                  
                  {participant.status === 'online' && (
                    <Box 
                      component="span" 
                      sx={{ 
                        width: 8, 
                        height: 8, 
                        bgcolor: 'success.main', 
                        borderRadius: '50%', 
                        display: 'inline-block',
                        ml: 1
                      }} 
                    />
                  )}
                </Box>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {participant.email || 'No email provided'}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ParticipantsList;