import React from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Box,
    Typography
} from "@mui/material";
import { Lock, Warning } from "@mui/icons-material";

interface PasswordData {
    current_password: string;
    new_password: string;
}

interface ProfileModalsProps {
    // Password Modal
    openPasswordModal: boolean;
    passwordData: PasswordData;
    onClosePasswordModal: () => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordReset: () => void;
    
    // Deactivate Modal
    openDeactivateModal: boolean;
    deactivatePassword: string;
    onCloseDeactivateModal: () => void;
    onDeactivatePasswordChange: (password: string) => void;
    onDeactivateAccount: () => void;
    
    t: (key: string) => string;
}

const ProfileModals: React.FC<ProfileModalsProps> = ({
    openPasswordModal,
    passwordData,
    onClosePasswordModal,
    onPasswordChange,
    onPasswordReset,
    openDeactivateModal,
    deactivatePassword,
    onCloseDeactivateModal,
    onDeactivatePasswordChange,
    onDeactivateAccount,
    t
}) => {
    return (
        <>
            {/* Password Reset Modal */}
            <Dialog 
                open={openPasswordModal} 
                onClose={onClosePasswordModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Lock color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {t('resetPasswordTitle')}
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        {t('resetPasswordDescription')}
                    </DialogContentText>
                    
                    <TextField
                        fullWidth
                        label={t('oldPassword')}
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={onPasswordChange}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label={t('newPassword')}
                        name="new_password"
                        type="password"
                        value={passwordData.new_password}
                        onChange={onPasswordChange}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={onClosePasswordModal}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={onPasswordReset} 
                        variant="contained"
                        disabled={!passwordData.current_password || !passwordData.new_password}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        {t('confirm')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Account Deactivation Modal */}
            <Dialog 
                open={openDeactivateModal} 
                onClose={onCloseDeactivateModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning color="error" />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                            {t('deactivateAccount')}
                        </Typography>
                    </Box>
                </DialogTitle>
                
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        {t('deactivateAccountConfirmation')}
                    </DialogContentText>
                    <DialogContentText sx={{ mb: 3, fontWeight: 500, color: 'error.main' }}>
                        {t('deactivateAccountWarning')}
                    </DialogContentText>
                    
                    <TextField
                        fullWidth
                        label={t('currentPassword')}
                        name="current_password"
                        type="password"
                        value={deactivatePassword}
                        onChange={(e) => onDeactivatePasswordChange(e.target.value)}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                            }
                        }}
                    />
                </DialogContent>
                
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={onCloseDeactivateModal}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none'
                        }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button 
                        onClick={onDeactivateAccount} 
                        color="error" 
                        variant="contained"
                        disabled={!deactivatePassword}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'error.dark',
                            }
                        }}
                    >
                        {t('deletePermanently')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProfileModals;