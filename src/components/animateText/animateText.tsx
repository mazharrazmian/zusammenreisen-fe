import React from "react";
import { Box, Typography, BoxProps } from "@mui/material";
import "./animateText.css";

const AnimatedText: React.FC = () => {
  // Define props for the Box component using BoxProps
  const boxProps: BoxProps = {
    sx: {
      position: "absolute",
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      backgroundColor: "#FFAB00",
      opacity: 0.8,
      top: "80%",
      left: "10%",
      animation: "sizeAnimation 3s infinite, floatAnimation1 4s infinite",
    },
  };

  return (
    <Box className="animated-container">
      {/* Decorative circles */}
      <Box {...boxProps} className="dot size-16 delay-0 top-80 left-10" />
      <Box
        {...boxProps}
        sx={{
          ...boxProps.sx,
          width: "20px",
          height: "20px",
          backgroundColor: "#00A76F",
          top: "20%",
          left: "90%",
          animation: "sizeAnimation 3s infinite 0.5s, floatAnimation1 4s infinite 0.5s",
        }}
        className="dot size-20 delay-0-5 color-00A76F top-20 left-90"
      />
      <Box
        {...boxProps}
        sx={{
          ...boxProps.sx,
          width: "12px",
          height: "12px",
          backgroundColor: "#00B8D9",
          top: "80%",
          left: "80%",
          animation: "sizeAnimation 3s infinite 1s, floatAnimation1 4s infinite 1s",
        }}
        className="dot size-12 delay-1 color-00B8D9 top-80 left-80"
      />
      <Box
        {...boxProps}
        sx={{
          ...boxProps.sx,
          width: "14px",
          height: "14px",
          backgroundColor: "#8E33FF",
          top: "25%",
          left: "15%",
          animation: "sizeAnimation 3s infinite 1.5s, floatAnimation1 4s infinite 1.5s",
        }}
        className="dot size-14 delay-1-5 color-8E33FF top-25 left-15"
      />

      {/* Main text */}
      {/* <Box className="text-line fade-in delay-0"> */}
        <Box >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
            mb: 1,
            whiteSpace: "nowrap", // Ensure text stays on one line
            fontSize: {
              xs: "1.5rem", // Smaller font size for mobile
              sm: "2rem", // Medium font size for tablets
              md: "2.5rem", // Larger font size for desktops
            },
          }}
        >
          <span className="highlight"> Explore</span> Together | <span className="highlight">Joy</span> Forever{" "}
          {/* <span className="highlight">Costs!</span> */}
        </Typography>
        <Box
          className="underline width-300 delay-1"
          sx={{
            position: "relative",
            height: "3px",
            backgroundColor: "#1877F2",
            width: "0%",
            margin: "0 auto",
            //animation: "drawLine 1s ease-out forwards 1s",
            maxWidth: {
              xs: "200px", // Smaller width for mobile
              sm: "250px", // Medium width for tablets
              md: "300px", // Larger width for desktops
            },
          }}
        />
      </Box>

      {/* Secondary text */}
      {/* <Box className="text-line fade-in delay-0-5">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: 0.5,
            whiteSpace: "nowrap", // Ensure text stays on one line
            fontSize: {
              xs: "1.25rem", // Smaller font size for mobile
              sm: "1.75rem", // Medium font size for tablets
              md: "2.5rem", // Larger font size for desktops
            },
          }}
        >
          Elevate <span className="highlight">The Fun</span>
        </Typography>
        <Box
          className="underline width-200 delay-1-5"
          sx={{
            position: "relative",
            height: "3px",
            backgroundColor: "#1877F2",
            width: "0%",
            margin: "0 auto",
            animation: "drawLine 1s ease-out forwards 1.5s",
            maxWidth: {
              xs: "150px", // Smaller width for mobile
              sm: "180px", // Medium width for tablets
              md: "200px", // Larger width for desktops
            },
          }}
        />
      </Box> */}
    </Box>
  );
};

export default AnimatedText;