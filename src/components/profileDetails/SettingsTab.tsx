import React from "react";
import { 
    Typography, 
    Box, 
    Button,
    Card,
    CardContent,
    Grid,
} from "@mui/material";
import { Delete, Lock, Email } from "@mui/icons-material";

interface SettingsTabProps {
    onOpenPasswordModal: () => void;
    onOpenDeactivateModal: () => void;
    onOpenForgotPasswordModal: () => void;
    t: (key: string) => string;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ 
    onOpenPasswordModal,
    onOpenDeactivateModal,
    onOpenForgotPasswordModal,
    t 
}) => {
    return (
        <Box sx={{ pt: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {t('accountSettings')}
            </Typography>
            
            <Grid container spacing={3}>
                {/* Security Settings */}
                <Grid item xs={12}>
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
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                {t('security')}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<Lock />}
                                    onClick={onOpenPasswordModal}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        py: 1.5,
                                        justifyContent: 'flex-start',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    {t('resetPassword')}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<Email />}
                                    onClick={onOpenForgotPasswordModal}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        py: 1.5,
                                        justifyContent: 'flex-start',
                                        '&:hover': {
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                >
                                    {t('forgotPassword')}
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Danger Zone */}
                <Grid item xs={12}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 3, 
                            border: '1px solid rgba(244, 67, 54, 0.2)',
                            backgroundColor: 'rgba(255, 245, 245, 0.8)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 1, 
                                    fontWeight: 500,
                                    color: 'error.main'
                                }}
                            >
                                {t('dangerZone')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {t('dangerZoneDescription')}
                            </Typography>
                            
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={onOpenDeactivateModal}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    py: 1.5,
                                    '&:hover': {
                                        backgroundColor: 'error.main',
                                        color: 'white',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(244, 67, 54, 0.3)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                {t('deactivateAccount')}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SettingsTab;