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
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import Logo from '../../assets/logo1.png';



const Footer = React.memo(() => {
  const { t } = useTranslation('footer');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const footerLinks = [
    // {
    //   title: t('company'),
    //   links: [
    //     { name: t('about'), path: '/about' },
    //     { name: t('careers'), path: '/careers' },
    //     { name: t('pressKit'), path: '/press' },
    //     { name: t('partnership'), path: '/partnership' }
    //   ]
    // },
    {
      title: t('resources'),
      links: [
        { name: t('blog'), path: '/blog/blog' },
        // { name: t('guides'), path: '/guides' },
        // { name: t('help'), path: '/help' },
        // { name: t('faq'), path: '/faq' }
      ]
    },
    {
      title: t('legal'),
      links: [
        { name: t('terms'), path: '/blog/terms' },
        { name: t('privacy'), path: '/blog/privacy-policy' },
        { name: t('cookies'), path: '/blog/cookies' },
        // { name: t('licenses'), path: '/blog/licenses' }
      ]
    }
    ,
    {
        title : t('developers'),
        links:[
            {name: t('Webarkitekt.com'), path: 'https://webarkitekten.com/'},
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

  return (
    <Box
      sx={{
        bgcolor: theme.palette.grey[100], // Light grey background        pt: 6,
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
                component="img"
                src={Logo}
                alt={t('travelMates')}
                sx={{ 
                  height: '60px',
                  width: 'auto',
                  mb: 2
                }}
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
                    <Link href={link.path} key={idx} underline="none" style={{ textDecoration: 'none' }}>
                      <Typography 
                        component={motion.div}
                        whileHover={{ x: 5 }}
                        variant="body2" 
                        key={idx} 
                        sx={{ 
                          mb: 1,
                          cursor: 'pointer',
                          '&:hover': { color: 'primary.main' }
                        }}
                        >
                        {link.name}
                      </Typography>
                      </Link>
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
                        <Typography 
                          component={motion.div}
                          variant="body2" 
                          key={idx} 
                          sx={{ 
                            mb: 1,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            '&:hover': { color: 'primary.main' }
                          }}
                          href={link.path}
                        //   onClick={() => navigateTo(link.path)}
                        >
                          {link.name}
                        </Typography>
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
                  <Typography variant="body2">support@travelmates.com</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">+1 (555) 123-4567</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">123 Travel Street, San Francisco, CA 94103</Typography>
                </Box>
              </Box>

              {/* Contact Support Button */}
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                color="primary"
                startIcon={<EmailIcon />}
                onClick={() => navigateTo('/contact')}
                sx={{
                  borderRadius: "8px",
                  px: 3,
                  py: 1,
                  fontWeight: 500
                }}
              >
                {t('contactSupport')}
              </Button>
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
            © {new Date().getFullYear()} TravelMates. {t('allRightsReserved')}
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="/blog/terms" underline="hover" color="text.secondary" variant="body2">
                {t('terms')}
              </Link>
              <Link href="/blog/privacy-policy" underline="hover" color="text.secondary" variant="body2">
                {t('privacy')}
              </Link>
              <Link href="/blog/cookies" underline="hover" color="text.secondary" variant="body2">
                {t('cookies')}
              </Link>
            </Box>
          )}
        </Box>
      </Container>
    </Box>

  );
});

export default Footer;