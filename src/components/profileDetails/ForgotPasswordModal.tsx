import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress
} from "@mui/material";
import { Email, CheckCircle } from "@mui/icons-material";

interface ForgotPasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
    t: (key: string) => string;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    open,
    onClose,
    onSubmit,
    t
}) => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError(t('emailRequired'));
            return;
        }

        if (!isValidEmail(email)) {
            setError(t('emailInvalid'));
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onSubmit(email);
            setSuccess(true);
        } catch (err) {
            setError(t('forgotPasswordError'));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail("");
        setError("");
        setSuccess(false);
        setLoading(false);
        onClose();
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    if (success) {
        return (
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogContent sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle 
                        sx={{ 
                            fontSize: 64, 
                            color: 'success.main', 
                            mb: 2 
                        }} 
                    />
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                        {t('emailSent')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('forgotPasswordEmailSent', { email })}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <Button 
                        onClick={handleClose} 
                        variant="contained"
                        size="large"
                        sx={{
                            borderRadius: 2,
                            px: 4,
                            textTransform: 'none'
                        }}
                    >
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog 
            open={open} 
            onClose={handleClose}
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
                    <Email color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {t('forgotPasswordTitle')}
                    </Typography>
                </Box>
            </DialogTitle>
            
            <DialogContent>
                <DialogContentText sx={{ mb: 3 }}>
                    {t('forgotPasswordDescription')}
                </DialogContentText>
                
                <TextField
                    fullWidth
                    label={t('emailAddress')}
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={!!error}
                    helperText={error}
                    disabled={loading}
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
                    onClick={handleClose} 
                    disabled={loading}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    {t('cancel')}
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained"
                    disabled={loading || !email.trim()}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: 120
                    }}
                >
                    {loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        t('sendResetEmail')
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPasswordModal;