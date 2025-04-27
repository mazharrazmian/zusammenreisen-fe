import { Box, Typography, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import footerServices from '../redux/api/footerService';

interface BlogContent {
  title: string;
  content: string;
}

const BlogPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<BlogContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await footerServices.getBlog(slug!);
        console.log(res.data)
        setContent(res?.data[0]);
      } catch (error) {
        console.error('Failed to load Content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  // declare inline styles
  const styles = {
     ul:{
      paddingLeft: '20px', /* Adjust based on your design */
      marginLeft: '20px',
     }
  }
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, ...styles }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!content) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h4" color="error">
          Page Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
      <Typography variant="h3" color="primary" gutterBottom>
        {content.title}
      </Typography>

      <Box
  sx={{
    mt: 4,
    color: 'text.secondary',
    fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
    fontSize: '1.125rem', // 18px — perfect for blogs
    lineHeight: 1.8,      // enough breathing room between lines
    letterSpacing: '0.015em', // slight spacing improves readability
    textAlign: 'justify', // optional: makes blog paragraphs super neat
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: 2,
      my: 3, // add vertical margin so image is not glued to text
    },
    '& img[alt="float-right"]': {
      float: 'right',
      marginLeft: 3,
      marginBottom: 2,
      maxWidth: '40%', 
      height: 'auto',
      borderRadius: 2,
    },
    '& p': {
      mb: 2,
      overflow: 'hidden',
    },
    '& h1, & h2, & h3': {
      mt: 4,
      mb: 2,
      color: 'primary.main',
      fontWeight: 700,
    },
    ...styles,
  }}
  dangerouslySetInnerHTML={{ __html: content.content }}
/>
</Box>

  );
};

export default BlogPage;
