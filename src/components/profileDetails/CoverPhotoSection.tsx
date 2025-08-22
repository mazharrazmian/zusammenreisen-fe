import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

interface CoverPhotoSectionProps {
    coverPhoto: string | null;
    onCoverPhotoChange: (file: File) => void;
    isCurrentUser?: boolean;
}

const CoverPhotoSection: React.FC<CoverPhotoSectionProps> = ({ 
    coverPhoto, 
    onCoverPhotoChange, 
    isCurrentUser = false 
}) => {
    const coverPhotoInputRef = useRef<HTMLInputElement>(null);

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            onCoverPhotoChange(file);
        }
    };

    return (
        <Box sx={{
            position: 'relative',
            height: { xs: 150, sm: 200 },
            backgroundColor: coverPhoto ? 'transparent' : '#e0e0e0',
            backgroundImage: coverPhoto ? `url(${coverPhoto})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: { xs: '8px 8px 0 0', sm: '12px 12px 0 0' },
        }}>
            {isCurrentUser && (
                <>
                    <input
                        id="cover-photo-upload"
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleCoverPhotoChange}
                        ref={coverPhotoInputRef}
                    />
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: { xs: 8, sm: 16 },
                            bottom: { xs: 8, sm: 16 },
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                transform: 'scale(1.05)',
                            },
                            transition: 'all 0.2s ease-in-out',
                            zIndex: 2
                        }}
                        onClick={() => coverPhotoInputRef.current?.click()}
                    >
                        <PhotoCamera sx={{ fontSize: { xs: 18, sm: 24 } }} />
                    </IconButton>
                </>
            )}
        </Box>
    );
};

export default CoverPhotoSection;