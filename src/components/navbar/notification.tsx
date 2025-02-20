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


type OnNotificationClick = (notification: Notification) => void;


interface NotificationComponentProps {
    notifications: Array<Notification>; // Array of notifications
    onNotificationClick: OnNotificationClick; // Function to handle notification clicks
    scrolled?: boolean; // Optional boolean to indicate if the component is scrolled
  }


const NotificationComponent : React.FC<NotificationComponentProps> = ({ notifications=[], onNotificationClick, scrolled = false }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const unreadCount = notifications.filter(notif => notif.unread).length;
  
  const handleOpenMenu = (event) => {
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
                bgcolor: notification.unread ? 'action.hover' : 'transparent',
                '&:hover': {
                  bgcolor: 'action.hover'
                },
                display: 'block',
                py: 1
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {notification.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {notification.message}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {new Date(notification.created_at).toLocaleDateString()}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default NotificationComponent;