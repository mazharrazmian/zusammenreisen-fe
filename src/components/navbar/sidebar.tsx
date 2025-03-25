import React, { useState, useEffect } from 'react';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Import icons
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useLocation } from 'react-router-dom';
import { Chat, Chat as ChatIcon } from '@mui/icons-material';
import FlightIcon from '@mui/icons-material/Flight';

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
    case 'chats':
        return <Chat />
    case 'my trips':
        return <FlightIcon/>
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
    <>
    <SidebarHeader>
        Travel Mates
        </SidebarHeader>      
      <ul sx={{ mt: 2 }}>
        {pages.map((page) => {
          const isActive = location.pathname === page.path;
          
          return (
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
          );
        })}
      </ul>
      </>
  );
};

export default Sidebar;