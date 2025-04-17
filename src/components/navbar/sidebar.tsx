import React, { useState, useEffect } from 'react';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Box,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// Import icons
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { useLocation } from 'react-router-dom';
import { Chat, Chat as ChatIcon, Logout } from '@mui/icons-material';
import FlightIcon from '@mui/icons-material/Flight';
import { useTheme } from "@mui/material/styles";

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

const Sidebar = ({ pages, navigate, onClose , handleLogout }) => {
    const { t } = useTranslation('navbar');
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Add 'profile' and 'Logout'  to pages if isMobile is true
    const modifiedPages = isMobile
        ? [...pages, { pageName: t('profile'), path: '/account' } , {pageName: t('logout'), path: '/'}]
        : pages;

    const handleNavigate = (page) => {
        // If the page is 'Logout', call handleLogout
        if (page.pageName === t('logout')) {
            handleLogout();
        }
        sessionStorage.setItem("toursFilters", JSON.stringify({}));
        navigate(page.path);
        // If onClose is provided (for mobile drawer), call it
        if (onClose) {
            onClose();
        }
    };

    const getIconForPage = (pageName) => {
        switch (pageName.toLowerCase()) {
            case t('home').toLowerCase():
                return <HomeIcon />;
            case t('dashboard').toLowerCase():
                return <DashboardIcon />;
            case t('chats').toLowerCase():
                return <Chat />;
            case t('myTrips').toLowerCase():
                return <FlightIcon />;
            case t('requests').toLowerCase():
                return <PeopleIcon />;
            case t('settings').toLowerCase():
                return <SettingsIcon />;
            case t('profile').toLowerCase():
                return <PeopleIcon />;
            case t('logout').toLowerCase():
                return <Logout/>
            default:
                return <HelpIcon />;
        }
    };

    return (
        <>
            <SidebarHeader>
                {t('travelMates')}
            </SidebarHeader>      
            <ul sx={{ mt: 2 }}>
                {modifiedPages.map((page) => {
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