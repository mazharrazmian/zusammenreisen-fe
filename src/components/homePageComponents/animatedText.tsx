import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define animations
const fadeIn = keyframes`
  0% { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const highlightText = keyframes`
  0% { color: #FFFFFF; }
  50% { color: #FFAB00; }
  100% { color: #FFFFFF; }
`;

const drawLine = keyframes`
  to {
    width: 100%;
  }
`;

const floatAnimation1 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(0, -10px); }
  100% { transform: translate(0, 0); }
`;

const floatAnimation2 = keyframes`
  0% { transform: translate(0, 0); }
  50% { transform: translate(0, 10px); }
  100% { transform: translate(0, 0); }
`;

const sizeAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

// Styled components
const AnimatedContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  overflow: 'hidden',
  width: '100%',
  height: '200px',
}));

const TextLine = styled(Box)(({ delay }) => ({
  position: 'relative',
  opacity: 0,
  animation: `${fadeIn} 1s ease-out forwards ${delay}s, ${pulse} 4s infinite ${delay}s`,
  display: 'inline-block',
  width: 'fit-content',
  textAlign: 'center',
}));

const Highlight = styled('span')({
  color: '#FFAB00',
  animation: `${highlightText} 3s infinite`,
});

const Underline = styled(Box)(({ width, delay }) => ({
  position: 'relative',
  height: '3px',
  backgroundColor: '#1877F2',
  width: '0%',
  margin: '0 auto',
  animation: `${drawLine} 1s ease-out forwards ${delay}s`,
  maxWidth: width,
}));

const Dot = styled(Box)(({ size, color, top, left, animationDelay }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: color,
  opacity: 0.8,
  top: top,
  left: left,
  animation: `${sizeAnimation} 3s infinite ${animationDelay}s, ${floatAnimation1} 4s infinite ${animationDelay}s`,
}));

const AnimatedText = () => {
  return (
    <AnimatedContainer>
      {/* Decorative circles */}
      <Dot size="16px" color="#FFAB00" top="80%" left="10%" animationDelay={0} />
      <Dot size="20px" color="#00A76F" top="20%" left="90%" animationDelay={0.5} />
      <Dot size="12px" color="#00B8D9" top="80%" left="80%" animationDelay={1} />
      <Dot size="14px" color="#8E33FF" top="25%" left="15%" animationDelay={1.5} />
      
      {/* Main text */}
      <TextLine delay={0}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            mb: 0.5
          }}
        >
          Zussamenreisen <Highlight>Cuts</Highlight> The <Highlight>Costs!</Highlight>
        </Typography>
        <Underline width="300px" delay={1} />
      </TextLine>
      
      {/* Secondary text */}
      <TextLine delay={0.5}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#FFFFFF',
            mt: 2,
            mb: 0.5
          }}
        >
          Elevates <Highlight>The Fun</Highlight>
        </Typography>
        <Underline width="200px" delay={1.5} />
      </TextLine>
    </AnimatedContainer>
  );
};

export default AnimatedText;