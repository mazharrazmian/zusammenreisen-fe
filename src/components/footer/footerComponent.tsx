import * as React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Link, 
  Divider, 
  useMediaQuery, 
  IconButton,
  Stack 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// Import icons
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import LogoWanderbuddies from '../../assets/logo-wanderbuddies.svg';
import LogoZusammenreisen from '../../assets/logo-zusammenreisen.svg'

const Footer = React.memo(() => {
  const { t } = useTranslation('footer');
  const hostname = window.location.hostname;

  const Logo = hostname.includes('zusammenreisen')
    ? LogoZusammenreisen
    : LogoWanderbuddies;
    
  const SITENAME = hostname.includes('zusammenreisen')
    ? 'Zusammenreisen'
    : 'Wanderbuddies';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  // Handle both internal and external links
  const handleLinkClick = (path) => {
    if (path.startsWith('http')) {
      // External link - open in new tab
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      // Internal link - use navigate
      navigateTo(path);
    }
  };

  const footerLinks = [
    {
      title: t('resources'),
      links: [
        { name: t('blog'), path: '/blog/blog' },
      ]
    },
    {
      title: t('legal'),
      links: [
        { name: t('terms'), path: '/blog/terms' },
        { name: t('privacy'), path: '/blog/privacy-policy' },
        { name: t('cookies'), path: '/blog/cookies' },
      ]
    },
    {
      title: t('developers'),
      links: [
        { name: t('Webarkitekt.com'), path: 'https://webarkitekt.com/' },
      ]
    }
  ];

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Component for rendering clickable links
  const ClickableLink = ({ link, variant = "body2", sx = {} }) => (
    <Typography 
      component={motion.div}
      whileHover={{ x: 5 }}
      variant={variant}
      sx={{ 
        mb: 1,
        cursor: 'pointer',
        color: 'text.secondary',
        textDecoration: 'none',
        '&:hover': { 
          color: 'primary.main',
          textDecoration: 'underline'
        },
        // Ensure proper touch targets for mobile
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        ...sx
      }}
      onClick={() => handleLinkClick(link.path)}
    >
      {link.name}
    </Typography>
  );

  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[100],
        pt: 6,
        pb: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
        marginTop: 8,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Company Info */}
          <Grid item xs={12} md={4}>
            <Box
              component='img'
              sx={{
                height: '80px',
                width: 'auto',
                display: { xs: 'none', md: 'flex' },
                cursor: 'pointer',
                marginRight: 2,
              }}
              alt={SITENAME}
              src={Logo}
              onClick={() => navigate('/')}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('footerDescription')}
            </Typography>
            
            {/* Social Media Icons */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <IconButton 
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size="small" 
                color="primary"
                aria-label="facebook"
                sx={{ minWidth: '44px', minHeight: '44px' }} // Ensure proper touch target
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size="small" 
                color="primary"
                aria-label="twitter"
                sx={{ minWidth: '44px', minHeight: '44px' }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton 
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size="small" 
                color="primary"
                aria-label="instagram"
                sx={{ minWidth: '44px', minHeight: '44px' }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                size="small" 
                color="primary"
                aria-label="linkedin"
                sx={{ minWidth: '44px', minHeight: '44px' }}
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          {/* Links Sections */}
          {!isSmall ? (
            <>
              {footerLinks.map((section, index) => (
                <Grid item xs={12} sm={6} md={2} key={index}>
                  <motion.div variants={itemVariants}>
                    <Typography 
                      variant="subtitle1" 
                      fontWeight="bold" 
                      gutterBottom
                    >
                      {section.title}
                    </Typography>
                    {section.links.map((link, idx) => (
                      <ClickableLink key={idx} link={link} />
                    ))}
                  </motion.div>
                </Grid>
              ))}
            </>
          ) : (
            <Grid item xs={12} sm={6} md={4}>
              <Grid container spacing={2}>
                {footerLinks.map((section, index) => (
                  <Grid item xs={4} key={index}>
                    <motion.div variants={itemVariants}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="bold" 
                        gutterBottom
                      >
                        {section.title}
                      </Typography>
                      {section.links.map((link, idx) => (
                        <ClickableLink 
                          key={idx} 
                          link={link} 
                          variant="body2"
                          sx={{ fontSize: '0.8rem' }}
                        />
                      ))}
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Contact Section */}
          <Grid item xs={12} md={4}>
            <motion.div variants={itemVariants}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t('contactUs')}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography 
                    variant="body2"
                    component="a"
                    href="mailto:support@wanderbuddies.com"
                    sx={{ 
                      color: 'text.secondary',
                      textDecoration: 'none',
                      '&:hover': { 
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    support@wanderbuddies.com
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">Freiburg, Germany</Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        
        {/* Copyright */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} {SITENAME} {t('allRightsReserved')}
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                component="span"
                variant="body2"
                sx={{ 
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => handleLinkClick('/blog/terms')}
              >
                {t('terms')}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ 
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => handleLinkClick('/blog/privacy-policy')}
              >
                {t('privacy')}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                sx={{ 
                  cursor: 'pointer',
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'primary.main',
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => handleLinkClick('/blog/cookies')}
              >
                {t('cookies')}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
});

export default Footer;