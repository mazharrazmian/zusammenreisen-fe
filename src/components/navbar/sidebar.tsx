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
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Import icons
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

// Create styled components
const SidebarContainer = styled(Paper)(({ theme, collapsed }) => ({
  width: collapsed ? 70 : 240,
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  overflow: 'hidden',
  transition: 'width 0.3s ease',
  height: '100%',
  position: 'relative'
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
    default:
      return <HelpIcon />;
  }
};

const Sidebar = ({ pages, navigate, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Find active page based on current location path
  const getActivePageId = () => {
    const currentPage = pages.find(page => location.pathname === page.path);
    return currentPage?.id || pages[0]?.id;
  };

  const handleNavigate = (page) => {
    sessionStorage.setItem("toursFilters", JSON.stringify({}));
    navigate(page.path);
    // If onClose is provided (for mobile drawer), call it
    if (onClose) {
      onClose();
    }
  };

  return (
    <SidebarContainer collapsed={collapsed} elevation={6}>
      <SidebarHeader>
        {!collapsed && (
          <Typography variant="h6" fontWeight="bold" color="primary">
            App Name
          </Typography>
        )}
        <IconButton 
          onClick={() => setCollapsed(!collapsed)}
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
  );
};

export default Sidebar;