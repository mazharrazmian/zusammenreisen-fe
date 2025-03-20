import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/store';
import Navbar from '../navbar';
import Sidebar from '../navbar/sidebar';
import { Outlet, useLocation } from "react-router-dom";


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get current pages based on authentication state
  const profile = useAppSelector((s) => s?.profile);
  const normalPages = [
    { id: 1, pageName: "Home", path: "/" },
    { id: 2, pageName: "Blog", path: "/blog" },  
  ];

  const loggedInPages = [
    { id: 3, pageName: "Requests", path: '/requests' },
    { id: 4, pageName: "My Trips", path: '/tripplanner' },
    { id: 5, pageName: 'Chats', path: '/chat' }
  ];

  const pages = profile?.profile ? normalPages.concat(loggedInPages) : normalPages;
  
  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleSidebarOpenToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Navbar with sidebar toggle */}
      <Navbar
        transparentOnHome={false}
        onSidebarToggle={handleSidebarOpenToggle}
      />
      
      {/* Fixed sidebar */}
      <Box sx={{ 
        position: 'fixed',
        height: '100vh', 
        zIndex: 1200,
        top: 0,
        left: 0,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <Sidebar 
          pages={pages} 
          navigate={navigate} 
          onCollapsedChange={handleSidebarToggle}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
      </Box>
      
      {/* Main content area */}
      <Box sx={{ 
        flexGrow: 1, 
        ml: {xs: 0, md: sidebarCollapsed ? '70px' : '240px'},
        transition: 'margin-left 0.3s ease',
        width: { xs: '100%', md: `calc(100% - ${sidebarCollapsed ? '70px' : '240px'})` },
        minHeight: '100vh',
        pt: '100px' // Add padding top to account for navbar
      }}>
        {/* Page content */}
      {children}
      </Box>
    </Box>
  );
};

export default MainLayout;