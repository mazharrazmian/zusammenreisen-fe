import React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import deFlag from "../../../assets/de-flag.png";
import enFlag from '../../../assets/en-flag.png'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";
  const isMobile = useMediaQuery("(max-width:600px)");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
    handleClose();
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return isMobile ? (
    <div>
      <IconButton 
        onClick={handleOpen} 
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '0px',
          padding: '2px',
          height: 'auto',
          minWidth: 'auto'
        }}
      >
        <LanguageIcon 
          sx={{ 
            color: "#000", 
            fontSize: '24px',
            marginRight: '2px' 
          }} 
        />
        <Typography 
          variant="caption" 
          color="black" 
          sx={{ 
            lineHeight: 1,
            fontSize: '0.75rem',
          }}
        >
          {currentLang === "en" ? "EN" : "DE"}
        </Typography>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleChange("en")}>
          <img
            src={enFlag}
            alt="English"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          English
        </MenuItem>
        <MenuItem onClick={() => handleChange("de")}>
          <img
            src={deFlag}
            alt="Deutsch"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          Deutsch
        </MenuItem>
      </Menu>
      
    </div>
  ) : (
    <div style={{ display: "flex", gap: "8px" }}>
      <IconButton
        onClick={() => handleChange("en")}
        sx={{
          padding: 0,
          border: currentLang === "en" ? "2px solid #1976d2" : "none",
          borderRadius: "50%",
        }}
      >
        <img
          src={enFlag}
          alt="English"
          style={{ width: "24px", height: "24px" }}
        />
      </IconButton>
      <IconButton
        onClick={() => handleChange("de")}
        sx={{
          padding: 0,
          border: currentLang === "de" ? "2px solid #1976d2" : "none",
          borderRadius: "50%",
        }}
      >
        <img
          src={deFlag}
          alt="Deutsch"
          style={{ width: "24px", height: "24px" }}
        />
      </IconButton>
    </div>
  );
};

export default LanguageSwitcher;