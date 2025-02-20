import React from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box } from '@/components/ui/card';
import { NotificationsIcon as Bell} from '@mui/icons-material/Notifications';

const NotificationComponent = ({ notifications = [], onNotificationClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuRef = React.useRef(null);
  
  const unreadCount = notifications.filter(notif => !notif.read).length;
  
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    handleCloseMenu();
  };

  return (
    <Box className="relative">
      <IconButton 
        onClick={handleOpenMenu}
        className="relative"
        ref={menuRef}
      >
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
          >
            {unreadCount}
          </Badge>
        )}
        <Bell className="h-6 w-6" />
      </IconButton>
      
      {menuRef.current && (
        <Menu
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorEl={menuRef.current}
          className="mt-2 p-2 w-80"
        >
          <div className="max-h-96 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <MenuItem className="text-gray-500">
                <Typography>No notifications</Typography>
              </MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 hover:bg-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex flex-col gap-1">
                    <Typography className="font-medium">
                      {notification.title}
                    </Typography>
                    <Typography className="text-sm text-gray-600">
                      {notification.message}
                    </Typography>
                    <Typography className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleDateString()}
                    </Typography>
                  </div>
                </MenuItem>
              ))
            )}
          </div>
        </Menu>
      )}
    </Box>
  );
};

export default NotificationComponent;