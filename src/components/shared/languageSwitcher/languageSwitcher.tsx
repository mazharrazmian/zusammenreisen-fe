import React from "react";
import { useTranslation } from "react-i18next";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const LanguageSwitcher = ({isTransparent } : {isTransparent : boolean}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "en";

  const handleChange = (event) => {
    i18n.changeLanguage(event.target.value);
    localStorage.setItem("i18nextLng", event.target.value);
  };

  return (
      <Select value={currentLang} 
        label="Language"
        variant="standard"
        sx={{
            color: !isTransparent ? "#000" : "#fff",
        }}
       onChange={handleChange}
       name="Language"
       >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="de">Deutsch</MenuItem>
      </Select>
  );
};

export default LanguageSwitcher;
