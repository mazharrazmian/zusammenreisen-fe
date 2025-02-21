import React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

const LanguageSelector = ({ allLanguages, selectedLanguages, onLanguagesChange }) => {
        const handleChange = (event, newValue) => {
        onLanguagesChange(newValue); // Keep it as array of objects
    };

    return (
        <Autocomplete
            multiple
            id="language-selector"
            options={allLanguages} 
            value={selectedLanguages}  // Keep as array of {name: "..."}
            getOptionLabel={(option) => option.name} 
            autoSelect 
            onChange={handleChange} 

            renderInput={(params) => (
                <TextField {...params} placeholder="Type or select languages" />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip key={index} label={option.name} {...getTagProps({ index })} />
                ))
            }
        />
    );
};

export default LanguageSelector;
