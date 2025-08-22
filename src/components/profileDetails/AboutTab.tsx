import React, { useState } from "react";
import { 
    Typography, 
    Box, 
    IconButton, 
    TextField, 
    Button,
    Card,
    CardContent
} from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";

interface Profile {
    about: string;
}

interface AboutTabProps {
    profile: Profile;
    isCurrentUser: boolean;
    onSaveAbout: (about: string) => void;
    t: (key: string) => string;
}

const AboutTab: React.FC<AboutTabProps> = ({ 
    profile, 
    isCurrentUser, 
    onSaveAbout,
    t 
}) => {
    const [editingAbout, setEditingAbout] = useState<boolean>(false);
    const [tempAbout, setTempAbout] = useState<string>(profile.about || "");

    const handleStartEditingAbout = () => {
        setTempAbout(profile.about || "");
        setEditingAbout(true);
    };

    const handleSaveAbout = () => {
        onSaveAbout(tempAbout);
        setEditingAbout(false);
    };

    const handleCancelEditAbout = () => {
        setTempAbout(profile.about || "");
        setEditingAbout(false);
    };

    return (
        <Box sx={{ pt: 3 }}>
            <Card 
                elevation={0} 
                sx={{ 
                    borderRadius: 3, 
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary'
                            }}
                        >
                            {t('aboutMe')}
                        </Typography>
                        {isCurrentUser && !editingAbout && (
                            <IconButton 
                                onClick={handleStartEditingAbout} 
                                size="small"
                                sx={{
                                    backgroundColor: 'primary.light',
                                    color: 'primary.contrastText',
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                        transform: 'scale(1.05)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                        )}
                    </Box>

                    {isCurrentUser && editingAbout ? (
                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                variant="outlined"
                                placeholder={t('writeAboutYourself')}
                                value={tempAbout}
                                onChange={(e) => setTempAbout(e.target.value)}
                                sx={{ 
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white',
                                    }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                <Button
                                    onClick={handleCancelEditAbout}
                                    startIcon={<Close />}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveAbout}
                                    startIcon={<Save />}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    {t('save')}
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                whiteSpace: 'pre-wrap',
                                color: 'text.secondary',
                                lineHeight: 1.6,
                                fontStyle: profile.about ? 'normal' : 'italic'
                            }}
                        >
                            {profile.about || t('noAboutInfoPublic')}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default AboutTab;