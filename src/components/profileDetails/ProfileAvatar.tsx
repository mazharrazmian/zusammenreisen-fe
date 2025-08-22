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
                    width: 120,
                    height: 120,
                    border: '4px solid white',
                    marginTop: '-60px',
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
                        top: 20,
                        left: 90,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        width: 36,
                        height: 36,
                        '&:hover': { 
                            backgroundColor: 'white',
                            transform: 'scale(1.05)',
                        },
                        transition: 'all 0.2s ease-in-out',
                    }}
                    component="label"
                >
                    <Edit fontSize="small" />
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