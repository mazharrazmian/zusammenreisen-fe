import React, { useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

const LanguageSelector = ({ allLanguages,onLanguagesChange }) => {

    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const handleChange = (event, newValue) => {
        setSelectedLanguages(newValue); // Update local state
        let languages = newValue.map(value=>value.name)
        onLanguagesChange(languages); // Pass selected languages to parent
      };
    

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={allLanguages} // List of all languages from the backend
      value={selectedLanguages} // Controlled value
      getOptionLabel={(option) => option.name} // Extract the "name" field for display
      autoSelect // Automatically select the first matching option
      onChange={handleChange} // Use the updated handler

      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Type or select languages"
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={index}
            label={option.name} // Display the "name" field in the chip
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default LanguageSelector;