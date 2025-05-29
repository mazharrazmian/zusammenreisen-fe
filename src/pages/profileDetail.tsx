import { useState, useEffect, useRef } from "react";
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Box,
    Card,
    Avatar,
    Typography,
    IconButton,
    Paper,
    Grid,
    Divider,
    Container,
    Tabs,
    Tab,
    Input,
    Chip
} from "@mui/material";
import {
    CloudUpload,
    Edit,
    Save,
    Close,
    PhotoCamera,
    Person,
    Delete
} from "@mui/icons-material";
import axios from "axios";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import LanguageSelector from "../components/language";
import { handleApiError } from "../redux/api/http-common";
import Navbar from "../components/navbar";
import { useTranslation } from 'react-i18next';
import { current } from "@reduxjs/toolkit";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { clearProfile } from "../redux/slice/profileSlice";
import { useAppSelector } from "../redux/store";

const ProfileDetail = () => {
    const { t } = useTranslation('accountpage');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useParams(); // Get userId from URL params
    const currentUser = useAppSelector(state => state.profile?.profile?.profile);
    const [user, setUser] = useState({ email: "", name: "" });
    const [profile, setProfile] = useState({
        id: "",
        picture: null,
        cover_picture: null,
        gender: "",
        age: "",
        languages: [],
        about: ""
    });
    const [languages, setLanguages] = useState([]);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openDeactivateModal, setOpenDeactivateModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ current_password: "", new_password: "" });
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
    const [editingAbout, setEditingAbout] = useState(false);
    const [tempAbout, setTempAbout] = useState("");
    const [activeTab, setActiveTab] = useState(0);
    const [deactivatePassword, setDeactivatePassword] = useState("");
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const coverPhotoInputRef = useRef(null);

    // Load user data
    useEffect(() => {
        setIsLoading(true);
        // if userId matches current user's ID, load current user's profile
        if (userId == currentUser?.id) {
            setIsCurrentUser(true);
            authServices.getProfile()
                .then(response => {
                    setUser({ email: response?.data?.email, name: response?.data?.name });
                    setProfile({
                        ...response.data.profile,
                        about: response.data.profile.about || ""
                    });
                    setSelectedLanguages(response.data.profile.languages || []);
                    setProfilePicturePreview(response.data.profile.picture);
                    setCoverPhotoPreview(response.data.profile.cover_picture);
                    setTempAbout(response.data.profile.about || "");
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    toast(t('couldNotFetchProfile'));
                    setIsLoading(false);
                });
        } else {
            // Load another user's profile
            setIsCurrentUser(false);
            authServices.getUserProfile(userId)
                .then(response => {
                    setUser({ email: response?.data.email, name: response?.data.name });
                    setProfile({
                        ...response.data.profile,
                        about: response.data.profile.about || ""
                    });
                    setSelectedLanguages(response.data.profile.languages || []);
                    setProfilePicturePreview(response.data.profile.picture);
                    setCoverPhotoPreview(response.data.profile.cover_picture);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    toast(t('couldNotFetchProfile'));
                    setIsLoading(false);
                });
        }

    }, [userId, currentUser]);


    useEffect(() => {
        // Only get languages if it's the current user (for editing purposes)

        if (isCurrentUser) {
            console.log("//getting all languages")
            authServices.getAllLanguages()
                .then(response => setLanguages(response?.data))
                .catch(() => toast(t('couldNotFetchLanguages')));
        }
    }, [isCurrentUser]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleProfilePictureChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfile(prevProfile => ({ ...prevProfile, picture: file }));
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

    const handleCoverPhotoChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setProfile(prevProfile => ({ ...prevProfile, cover_picture: file }));
            setCoverPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileUpdate = () => {
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (key === "languages") {
                const languagesForAPI = selectedLanguages.map(lang => lang.name);
                languagesForAPI.forEach(language => formData.append("languages", language));
            } else if (key === "picture" || key === "cover_picture") {
                if (profile[key] instanceof File) {
                    formData.append(key, profile[key]);
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

    const handleStartEditingAbout = () => {
        setTempAbout(profile.about);
        setEditingAbout(true);
    };

    const handleSaveAbout = () => {
        setProfile(prev => ({ ...prev, about: tempAbout }));
        setEditingAbout(false);

        const aboutFormData = new FormData();
        aboutFormData.append('about', tempAbout);
        authServices.updateProfile(profile.id, aboutFormData)
            .then(() => toast(t('profileUpdated')))
            .catch(() => toast(t('profileUpdateFailed')));
    };

    const handleCancelEditAbout = () => {
        setTempAbout(profile.about);
        setEditingAbout(false);
    };

    const handleDeactivateAccount = () => {
        authServices.deleteAccount({ current_password: deactivatePassword })
            .then(() => {
                toast(t('accountDeleted'));
                Cookies.remove("accessToken", { path: "/" });
                Cookies.remove("refreshToken", { path: "/" });
                dispatch(clearProfile())
                navigate('/')
            })
            .catch(error => {
                handleApiError(error);
            });

        setOpenDeactivateModal(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (isLoading) return (
        <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <Typography>{t('loading')}</Typography>
        </Container>
    );

    return (
        <Container maxWidth="md">
            <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
                {/* Cover Photo Section */}
                <Box sx={{
                    position: 'relative',
                    height: 200,
                    backgroundColor: coverPhotoPreview ? 'transparent' : '#e0e0e0',
                    backgroundImage: coverPhotoPreview ? `url(${coverPhotoPreview})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                                    right: 16,
                                    bottom: 16,
                                    backgroundColor: 'white',
                                    boxShadow: 1,
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5'
                                    },
                                    zIndex: 2
                                }}
                                onClick={() => coverPhotoInputRef.current.click()}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </>
                    )}
                </Box>

                <Box sx={{ p: 3, pt: 0, position: 'relative' }}>
                    {/* Profile Picture */}
                    <Avatar
                        src={profilePicturePreview}
                        sx={{
                            width: 120,
                            height: 120,
                            border: '4px solid white',
                            marginTop: '-60px',
                            boxShadow: 1,
                            position: 'relative',
                            objecctFit: 'cover',
                        }}
                    >
                        {!profilePicturePreview && <Person fontSize="large" />}
                    </Avatar>

                    {isCurrentUser && (
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: 20,
                                left: 90,
                                backgroundColor: 'white',
                                boxShadow: 1,
                                width: 36,
                                height: 36,
                                '&:hover': { backgroundColor: '#f5f5f5' }
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

                    {/* User Name */}
                    <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
                        {user.name}
                    </Typography>

                    {/* Tabs - Different for current user vs other users */}
                    <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                        >
                            <Tab label={t('profile')} />
                            <Tab label={t('about')} />
                            {isCurrentUser && <Tab label={t('settings')} />}
                        </Tabs>
                    </Box>

                    {/* Profile Tab */}
                    {activeTab === 0 && (
                        <Box sx={{ pt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t('name')}
                                        value={user?.name}
                                        disabled
                                        variant="outlined"
                                    />
                                </Grid>
                                    {/* Email field - only shown for current user */}
                                    {isCurrentUser && (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                //Not adding label because it causes some display issues
                                                //TODO : Add label and fix display issues
                                                aria-label={t('email')}
                                                value={user.email}
                                                disabled
                                                variant="outlined"
                                            />
                                        </Grid>
                                    )}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t('age')}
                                        name="age"
                                        type="number"
                                        value={profile.age}
                                        onChange={isCurrentUser ? handleProfileChange : undefined}
                                        disabled={!isCurrentUser}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>{t('gender')}</InputLabel>
                                        <Select
                                            name="gender"
                                            value={profile.gender}
                                            onChange={isCurrentUser ? handleProfileChange : undefined}
                                            disabled={!isCurrentUser}
                                            label={t('gender')}
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
                                            onLanguagesChange={setSelectedLanguages}
                                        />
                                    ) : (
                                        <Box>
                                            <Typography variant="subtitle1">{t('languages')}</Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                {selectedLanguages.map((lang, index) => (
                                                    <Chip key={index} label={lang.name} />
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
                                            onClick={handleProfileUpdate}
                                            startIcon={<Save />}
                                            sx={{ mr: 2 }}
                                        >
                                            {t('saveChanges')}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => setOpenPasswordModal(true)}
                                        >
                                            {t('resetPassword')}
                                        </Button>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {/* About Tab */}
                    {activeTab === 1 && (
                        <Box sx={{ pt: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Typography variant="h6">{t('aboutMe')}</Typography>
                                {isCurrentUser && !editingAbout && (
                                    <IconButton onClick={handleStartEditingAbout} size="small">
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
                                        sx={{ mb: 2 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button
                                            onClick={handleCancelEditAbout}
                                            startIcon={<Close />}
                                            sx={{ mr: 1 }}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSaveAbout}
                                            startIcon={<Save />}
                                        >
                                            {t('save')}
                                        </Button>
                                    </Box>
                                   
                                </Box>

                            ) : (
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {profile.about || t('noAboutInfoPublic')}
                                </Typography>
                            )}
                        </Box>
                    )}

                    {/* Settings Tab - Only visible for current user */}
                    {isCurrentUser && activeTab === 2 && (
                        <Box sx={{ pt: 3 }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>{t('accountSettings')}</Typography>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<Delete />}
                                onClick={() => setOpenDeactivateModal(true)}
                                sx={{ mt: 2 }}
                            >
                                {t('deactivateAccount')}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Modals - Only for current user */}
            {isCurrentUser && (
                <>
                    {/* Password Reset Modal */}
                    <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                        <DialogTitle>{t('resetPasswordTitle')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label={t('oldPassword')}
                                name="current_password"
                                type="password"
                                onChange={handlePasswordChange}
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label={t('newPassword')}
                                name="new_password"
                                type="password"
                                onChange={handlePasswordChange}
                                margin="normal"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPasswordModal(false)} color="inherit">{t('cancel')}</Button>
                            <Button onClick={handlePasswordReset} color="primary" variant="contained">{t('confirm')}</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Account Deactivation Modal */}
                    <Dialog open={openDeactivateModal} onClose={() => setOpenDeactivateModal(false)}>
                        <DialogTitle>{t('deactivateAccount')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {t('deactivateAccountConfirmation')}
                            </DialogContentText>
                            <TextField
                                fullWidth
                                label={t('currentPassword')}
                                name="current_password"
                                type="password"
                                onChange={(e) => setDeactivatePassword(e.target.value)}
                                margin="normal"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeactivateModal(false)} color="inherit">
                                {t('cancel')}
                            </Button>

                            <Button onClick={handleDeactivateAccount} color="error" variant="contained">
                                {t('deletePermanently')}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Container>
    );
};

export default ProfileDetail;