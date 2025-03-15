import React from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Box,
  Badge,
  Divider
} from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Notification } from '../../types';
import chatServices from '../../redux/api/chatServices';
import { Circle as CircleIcon } from '@mui/icons-material';

type OnNotificationClick = (notification: Notification) => void;
type updateNotification = (notification: Notification) => void;



interface NotificationComponentProps {
    notifications: Array<Notification>; // Array of notifications
    onNotificationClick: OnNotificationClick; // Function to handle notification clicks
    updateNotification : updateNotification;
    scrolled?: boolean; // Optional boolean to indicate if the component is scrolled
  }


const NotificationComponent : React.FC<NotificationComponentProps> = ({ notifications=[],
     onNotificationClick,
      scrolled = false,
      updateNotification,
    }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const unreadCount = notifications.filter(notif => notif.unread).length;
  
  const handleOpenMenu = (event : any) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  


  const handleNotificationClick = (notification : Notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    handleCloseMenu();
  };

  return (
    <Box>
      <IconButton onClick={handleOpenMenu}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon 
            sx={{
              color: scrolled ? "#000" : "#fff",
              ":hover": { color: "#1877F2" },
              transition: "color 0.3s ease"
            }}
          />
        </Badge>
      </IconButton>
      
      <Menu
        sx={{ mt: 2 }}
        id="notifications-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            maxHeight: 400,
            width: '300px',
            overflowY: 'auto'
          }
        }}
      >
        {(!notifications || notifications.length === 0) ? (
          <MenuItem>
            <Typography sx={{ color: 'text.secondary' }}>
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification)}
            sx={{
              bgcolor: notification.unread ? '#EBF5FF' : 'transparent',
              '&:hover': {
                bgcolor: '#F5F9FF'
              },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              p: 2,
              borderBottom: '1px solid #E0E0E0'
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                {notification.unread && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      flexShrink: 0
                    }}
                  />
                )}
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: notification.unread ? 700 : 500,
                    color: notification.unread ? '#1976d2' : 'text.primary'
                  }}
                >
                  {notification.title}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                
                sx={{ 
                  color: notification.unread ? 'text.primary' : 'text.secondary',
                  mb: 0.5,
                  whiteSpace: 'normal',    // Allows text to wrap
                    wordWrap: 'break-word',  // Ensures long words wrap
                    overflow: 'visible',     // Prevents hiding text
                    display: 'block'         // Ensures proper wrapping
                }}
              >
                {notification.message}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {new Date(notification.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            

            <IconButton 
              size="small"
              onClick={(e) => {
                e.stopPropagation(); // Prevent MenuItem onClick from firing
                updateNotification(notification);
              }}
              sx={{
                ml: 1,
                opacity: notification.unread ? 1 : 0.3,
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              <CircleIcon 
                sx={{ 
                  fontSize: 16,
                  color: notification.unread ? '#1976d2' : '#bdbdbd'
                }} 
              />
            </IconButton>
          </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default NotificationComponent;