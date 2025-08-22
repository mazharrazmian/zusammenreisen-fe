import React from "react";
import { 
    TextField, 
    Button, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Grid, 
    Box, 
    Typography, 
    Chip,
    SelectChangeEvent
} from "@mui/material";
import { Save } from "@mui/icons-material";
import LanguageSelector from "../language";

interface Language {
    id: number;
    name: string;
}

interface User {
    email: string;
    name: string;
}

interface Profile {
    id: string;
    picture: File | string | null;
    cover_picture: File | string | null;
    gender: string | number;
    age: string | number;
    languages: Language[];
    about: string;
}

interface ProfileTabProps {
    user: User;
    profile: Profile;
    languages: Language[];
    selectedLanguages: Language[];
    isCurrentUser: boolean;
    onProfileChange: (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => void;
    onLanguagesChange: (languages: Language[]) => void;
    onProfileUpdate: () => void;
    t: (key: string) => string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
    user, 
    profile, 
    languages, 
    selectedLanguages, 
    isCurrentUser, 
    onProfileChange, 
    onLanguagesChange, 
    onProfileUpdate,
    t 
}) => {
    return (
        <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('name')}
                        value={user?.name || ''}
                        disabled
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            }
                        }}
                    />
                </Grid>
                
                {isCurrentUser && (
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('email')}
                            value={user?.email || ''}
                            disabled
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                }
                            }}
                        />
                    </Grid>
                )}

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label={t('age')}
                        name="age"
                        type="number"
                        value={profile.age || ''}
                        onChange={isCurrentUser ? onProfileChange : undefined}
                        disabled={!isCurrentUser}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: !isCurrentUser ? 'rgba(0, 0, 0, 0.02)' : 'white',
                            }
                        }}
                    />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>{t('gender')}</InputLabel>
                        <Select
                            name="gender"
                            value={profile.gender || ''}
                            onChange={isCurrentUser ? onProfileChange : undefined}
                            disabled={!isCurrentUser}
                            label={t('gender')}
                            sx={{
                                backgroundColor: !isCurrentUser ? 'rgba(0, 0, 0, 0.02)' : 'white',
                            }}
                        >
                            <MenuItem value={1}>{t('male')}</MenuItem>
                            <MenuItem value={2}>{t('female')}</MenuItem>
                            <MenuItem value={3}>{t('other')}</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                    {isCurrentUser ? (
                        <LanguageSelector
                            allLanguages={languages}
                            selectedLanguages={selectedLanguages}
                            onLanguagesChange={onLanguagesChange}
                            disablePortal={false}
                        />
                    ) : (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                                {t('languages')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {selectedLanguages.map((lang, index) => (
                                    <Chip 
                                        key={index} 
                                        label={lang.name} 
                                        sx={{
                                            backgroundColor: 'primary.light',
                                            color: 'primary.contrastText',
                                        }}
                                    />
                                ))}
                                {selectedLanguages.length === 0 && (
                                    <Typography variant="body2" color="text.secondary">
                                        {t('noLanguagesSpecified')}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )}
                </Grid>
                
                {isCurrentUser && (
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onProfileUpdate}
                            startIcon={<Save />}
                            size="large"
                            sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {t('saveChanges')}
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ProfileTab;