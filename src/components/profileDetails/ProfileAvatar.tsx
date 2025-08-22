import React from "react";
import { Avatar, IconButton } from "@mui/material";
import { Edit, Person } from "@mui/icons-material";

interface ProfileAvatarProps {
    profilePicture: string | null;
    onProfilePictureChange: (file: File) => void;
    isCurrentUser?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ 
    profilePicture, 
    onProfilePictureChange, 
    isCurrentUser = false 
}) => {
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            onProfilePictureChange(file);
        }
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
                src={profilePicture || undefined}
                sx={{
                    width: { xs: 80, sm: 100, md: 120 },
                    height: { xs: 80, sm: 100, md: 120 },
                    border: '4px solid white',
                    marginTop: { xs: '-40px', sm: '-50px', md: '-60px' },
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    objectFit: 'cover',
                }}
            >
                {!profilePicture && <Person fontSize="large" />}
            </Avatar>

            {isCurrentUser && (
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: { xs: 10, sm: 15, md: 20 },
                        left: { xs: 60, sm: 75, md: 90 },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: { xs: 28, sm: 32, md: 36 },
                        height: { xs: 28, sm: 32, md: 36 },
                        '&:hover': { 
                            backgroundColor: 'white',
                            transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                    component="label"
                >
                    <Edit sx={{ fontSize: { xs: 16, sm: 18, md: 20 } }} />
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                    />
                </IconButton>
            )}
        </div>
    );
};

export default ProfileAvatar;