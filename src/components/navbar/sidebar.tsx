import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Paper,
  Typography,
  Box,
  Divider,
  Tooltip,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// Import icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { useLocation } from 'react-router-dom';

// Create styled components
const SidebarContainer = styled(Paper)(({ theme, collapsed, isMobile, open }) => ({
  width: collapsed ? 70 : 240,
  backgroundColor: theme.palette.background.default,
  borderRadius: 0,
  overflow: 'hidden',
  transition: 'width 0.3s ease, transform 0.3s ease',
  height: '100%',
  position: isMobile ? 'fixed' : 'relative',
  zIndex: 1200,
  transform: isMobile && !open ? 'translateX(-100%)' : 'translateX(0)',
  boxShadow: isMobile ? theme.shadows[10] : theme.shadows[3],
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  margin: theme.spacing(0.8, 1),
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0,0,0,0.07)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.dark
    }
  },
  ...(active && {
    backgroundColor: theme.palette.primary.main + '20',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      color: theme.palette.primary.dark
    }
  })
}));

// Backdrop for mobile
const Backdrop = styled(Box)(({ theme, open }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1199,
  display: open ? 'block' : 'none',
  transition: 'opacity 0.3s ease',
  opacity: open ? 1 : 0,
}));

// Map icons to pages
const getIconForPage = (pageName) => {
  switch (pageName.toLowerCase()) {
    case 'home':
      return <HomeIcon />;
    case 'dashboard':
      return <DashboardIcon />;
    case 'users':
    case 'team':
    case 'people':
    case 'requests':
      return <PeopleIcon />;
    case 'settings':
      return <SettingsIcon />;
    case 'my trips':
      return <FlightTakeoffIcon />;
    case 'chats':
      return <ChatIcon />;
    case 'blog':
      return <HelpIcon />; // Replace with appropriate icon
    default:
      return <HelpIcon />;
  }
};

const Sidebar = ({ pages, navigate, onCollapsedChange, open, onOpenChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Read the initial collapsed state from localStorage, defaulting to false
  const [collapsed, setCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const location = useLocation();

  // Update localStorage whenever collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    
    // Notify parent about the collapse state change
    if (onCollapsedChange) {
      onCollapsedChange(collapsed);
    }
  }, [collapsed, onCollapsedChange]);

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile && onOpenChange) {
      onOpenChange(false);
    }
  }, [location.pathname, isMobile, onOpenChange]);

  const handleNavigate = (page) => {
    sessionStorage.setItem("toursFilters", JSON.stringify({}));
    navigate(page.path);
    
    // Close sidebar on mobile when navigating
    if (isMobile && onOpenChange) {
      onOpenChange(false);
    }
  };
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleBackdropClick = () => {
    if (isMobile && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <>
      {isMobile && <Backdrop open={open} onClick={handleBackdropClick} />}
      <SidebarContainer collapsed={collapsed} isMobile={isMobile} open={open} elevation={3}>
        <SidebarHeader>
          {!collapsed && (
            <Typography variant="h6" fontWeight="bold" color="primary">
              TravelMates
            </Typography>
          )}
          <IconButton 
            onClick={toggleCollapsed}
            size="small"
          >
            {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </IconButton>
        </SidebarHeader>
        
        <Divider sx={{ mx: 2, opacity: 0.6 }} />
        
        <List sx={{ mt: 2 }}>
          {pages.map((page) => {
            const isActive = location.pathname === page.path;
            
            return (
              <Tooltip 
                key={page.id} 
                title={collapsed ? page.pageName : ""} 
                placement="right"
              >
                <StyledListItemButton
                  onClick={() => handleNavigate(page)}
                  active={isActive ? 1 : 0}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 40, color: 'text.secondary' }}>
                    {getIconForPage(page.pageName)}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={page.pageName} 
                      primaryTypographyProps={{
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </StyledListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;