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
import { Notification, Profile } from '../../types';
import chatServices from '../../redux/api/chatServices';
import { Circle as CircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ContentTypeMap } from '../../Constants';
import { useTranslation } from 'react-i18next';

interface NotificationComponentProps {
    scrolled?: boolean; // Optional boolean to indicate if the component is scrolled
    profile : Profile;
    isTransparent : boolean,
}

const NotificationComponent : React.FC<NotificationComponentProps> = ({ 
    scrolled = false,
    profile,
    isTransparent
}) => {
    const { t } = useTranslation('navbar');
    const navigate = useNavigate()
    const [notifications, setNotifications] = React.useState<Array<Notification>>([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [lastUpdate, setLastUpdate] = React.useState(Date.now());
    
    const unreadCount = notifications.filter(notif => notif.unread).length;
    
    const handleOpenMenu = (event : any) => {
        setAnchorEl(event.currentTarget);
        // Fetch latest notifications when menu is opened
        fetchNotifications();
    };
    
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    
    const fetchNotifications = async () => {
        if (!profile?.profile) return;
        
        try {
            const response = await chatServices.getNotifications();
            setNotifications(response.data);
            setLastUpdate(Date.now());
        } catch (error) {
            console.log("Error fetching notifications:", error);
        }
    }

    React.useEffect(() => {
        // Initial fetch
        if (profile?.profile) {
            fetchNotifications();
        }
        
        // Set up polling interval
        const pollingInterval = setInterval(() => {
            fetchNotifications();
        }, 30 * 1000); // Reduced to 30 seconds for more frequent updates
        
        return () => clearInterval(pollingInterval);
    }, [profile?.profile]); // Add profile as dependency

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read in the backend
            await chatServices.updateNotification(notification);
            
            // Update local state immediately
            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif.id === notification.id ? { ...notif, unread: false } : notif
                )
            );
            
            handleCloseMenu();
            // If the notification is about a request, just go to the requests page.
            // No need to go to trip detail, as the user isn't allowed there anyways.
            let page = ContentTypeMap[notification.content_type]
            if (page == 'requests'){
                navigate(`/${page}`);
            }
            else{
                navigate(`/${page}/${notification.object_id}`)
            }
        } catch (error) {
            console.log("Error updating notification:", error);
        }
    }

    const handleNotificationRead = async (notification: Notification, event: React.MouseEvent) => {
        // Prevent the parent MenuItem click event
        event.stopPropagation();
        
        try {
            // Mark as read in the backend
            const response = await chatServices.updateNotification(notification);
            
            // Update local state with the response data
            setNotifications(prevNotifications =>
                prevNotifications.map(notif =>
                    notif.id === notification.id ? response.data : notif
                )
            );
        } catch (error) {
            console.log("Error marking notification as read:", error);
        }
    }

    return (
        <Box>
            <IconButton onClick={handleOpenMenu}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon 
                        sx={{
                            color: !isTransparent ? "#000" : "#fff",
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
                            {t('noNotifications')}
                        </Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={`${notification.id}-${notification.unread}`}
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
                                        whiteSpace: 'normal',
                                        wordWrap: 'break-word',
                                        overflow: 'visible',
                                        display: 'block'
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
                                onClick={(e) => handleNotificationRead(notification, e)}
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