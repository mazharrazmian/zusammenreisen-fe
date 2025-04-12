import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import axios from "axios";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import LanguageSelector from "../components/language";
import { handleApiError } from "../redux/api/http-common";
import Navbar from "../components/navbar";
import { CloudUpload } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { t } = useTranslation('accountpage');
    const [user, setUser] = useState({ email: "", name: "" });
    const [profile, setProfile] = useState({ id: "", picture: null, gender: "", age: "", languages: [] });
    const [languages, setLanguages] = useState([]);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "" });
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null); // Preview for uploaded image

    useEffect(() => {
        authServices.getProfile()
            .then(response => {
                setUser({ email: response?.data.email, name: response?.data.name });
                setProfile(response.data.profile);
                setSelectedLanguages(response.data.profile.languages || []);
                setPreviewImage(response.data.profile.picture); // Set initial picture preview
            })
            .catch(error => {
                console.log(error);
                toast(t('couldNotFetchProfile'));
            });

        authServices.getAllLanguages()
            .then(response => setLanguages(response.data))
            .catch(() => toast(t('couldNotFetchLanguages')));
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfile(prevProfile => ({ ...prevProfile, picture: file })); // Store file
            setPreviewImage(URL.createObjectURL(file)); // Show preview immediately
        }
    };

    const handleProfileUpdate = () => {
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (key === "languages") {
                const languagesForAPI = selectedLanguages.map(lang => lang.name);
                languagesForAPI.forEach(language => formData.append("languages", language));
            } else if (key === "picture") {
                if (profile.picture instanceof File) {
                    formData.append("picture", profile.picture);
                }
            } else {
                formData.append(key, profile[key]);
            }
        });

        authServices.updateProfile(profile.id, formData)
            .then(() => toast(t('profileUpdated')))
            .catch(() => toast(t('profileUpdateFailed')));
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordReset = () => {
        authServices.setPassword({ current_password: passwordData.current_password, new_password: passwordData.new_password })
            .then(() => {
                toast(t('passwordChanged'));
                setOpenPasswordModal(false);
            })
            .catch(error => {
                handleApiError(error);
                toast(t('passwordChangeFailed'));
            });
    };

    if (!profile.id) return <p>{t('loading')}</p>;

    return (
        <>
            <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
                <h2>{t('profile')}</h2>
                
                {/* Updated Profile Picture Upload - entire area clickable */}
                <div style={{ position: "relative", display: "inline-block" }}>
                    <label htmlFor="fileUpload" style={{ 
                        display: "block", 
                        cursor: "pointer",
                        position: "relative"
                    }}>
                        <div style={{
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            overflow: "hidden",
                            position: "relative"
                        }}>
                            <img 
                                src={previewImage} 
                                alt={t('profile')} 
                                style={{ 
                                    width: "100%", 
                                    height: "100%", 
                                    objectFit: "cover" 
                                }} 
                            />
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: "rgba(0, 0, 0, 0.5)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "4px 0"
                            }}>
                                <CloudUpload fontSize="small" style={{ marginRight: "4px" }} />
                                <small>{t('change')}</small>
                            </div>
                        </div>
                    </label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: "none" }} 
                        id="fileUpload"
                    />
                </div>

                <TextField fullWidth label={t('name')} value={user.name} disabled margin="normal" />
                <TextField fullWidth label={t('email')} value={user.email} disabled margin="normal" />
                <TextField fullWidth label={t('age')} name="age" type="number" value={profile.age} onChange={handleProfileChange} margin="normal" />
                
                <FormControl fullWidth margin="normal">
                    <InputLabel>{t('gender')}</InputLabel>
                    <Select name="gender" value={profile.gender} onChange={handleProfileChange}>
                        <MenuItem value={1}>{t('male')}</MenuItem>
                        <MenuItem value={2}>{t('female')}</MenuItem>
                        <MenuItem value={3}>{t('other')}</MenuItem>
                    </Select>
                </FormControl>

                {/* Language Selector */}
                <LanguageSelector allLanguages={languages} selectedLanguages={selectedLanguages} onLanguagesChange={setSelectedLanguages} />

                <Button variant="contained" color="primary" onClick={handleProfileUpdate} style={{ margin: "10px 0" }}>{t('saveChanges')}</Button>
                <Button variant="outlined" color="secondary" onClick={() => setOpenPasswordModal(true)}>{t('resetPassword')}</Button>

                {/* Password Reset Modal */}
                <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                    <DialogTitle>{t('resetPasswordTitle')}</DialogTitle>
                    <DialogContent>
                        <TextField fullWidth label={t('oldPassword')} name="current_password" type="password" onChange={handlePasswordChange} margin="normal" />
                        <TextField fullWidth label={t('newPassword')} name="new_password" type="password" onChange={handlePasswordChange} margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPasswordModal(false)} color="secondary">{t('cancel')}</Button>
                        <Button onClick={handlePasswordReset} color="primary">{t('confirm')}</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default ProfilePage;