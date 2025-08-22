import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Box,
    Typography,
    Tabs,
    Tab,
    SelectChangeEvent
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// Import components
import CoverPhotoSection from "../../components/profileDetails/CoverPhotoSection";
import ProfileAvatar from "../../components/profileDetails/ProfileAvatar";
import ProfileTab from "../../components/profileDetails/ProfileTab";
import AboutTab from "../../components/profileDetails/AboutTab";
import SettingsTab from "../../components/profileDetails/SettingsTab";
import ProfileModals from "../../components/profileDetails/ProfileModals";
import ForgotPasswordModal from "../../components/profileDetails/ForgotPasswordModal";
import NotificationPreferences from "../../components/profileDetails/notificationPreferences";

// Import services
import authServices from "../../redux/api/authService";
import { handleApiError } from "../../redux/api/http-common";
import { clearProfile } from "../../redux/slice/profileSlice";
import { useAppSelector } from "../../redux/store";

// Types
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

interface PasswordData {
    current_password: string;
    new_password: string;
}

const ProfileDetail: React.FC = () => {
    const { t } = useTranslation('accountpage');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userId } = useParams<{ userId: string }>();
    const currentUser = useAppSelector(state => state.profile?.profile?.profile);

    // State
    const [user, setUser] = useState<User>({ email: "", name: "" });
    const [profile, setProfile] = useState<Profile>({
        id: "",
        picture: null,
        cover_picture: null,
        gender: "",
        age: "",
        languages: [],
        about: ""
    });
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Modal states
    const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
    const [openDeactivateModal, setOpenDeactivateModal] = useState<boolean>(false);
    const [openForgotPasswordModal, setOpenForgotPasswordModal] = useState<boolean>(false);
    const [passwordData, setPasswordData] = useState<PasswordData>({ 
        current_password: "", 
        new_password: "" 
    });
    const [deactivatePassword, setDeactivatePassword] = useState<string>("");

    // Load user data
    useEffect(() => {
        setIsLoading(true);
        
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
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    toast.error(t('couldNotFetchProfile'));
                    setIsLoading(false);
                });
        } else {
            setIsCurrentUser(false);
            authServices.getUserProfile(userId!)
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
                    toast.error(t('couldNotFetchProfile'));
                    setIsLoading(false);
                });
        }
    }, [userId, currentUser]);

    // Get languages for current user
    useEffect(() => {
        if (isCurrentUser) {
            authServices.getAllLanguages()
                .then(response => setLanguages(response?.data))
                .catch(() => toast.error(t('couldNotFetchLanguages')));
        }
    }, [isCurrentUser]);

    // Handlers
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const updateImageField = async (fieldName: string, file: File) => {
        const formData = new FormData();
        formData.append(fieldName, file);
        
        try {
            await authServices.updateProfile(profile.id, formData);
            toast.success(t('profileUpdated'));
        } catch (error) {
            toast.error(t('profileUpdateFailed'));
            console.error('Image update failed:', error);
        }
    };

    const handleProfilePictureChange = (file: File) => {
        setProfile(prevProfile => ({ ...prevProfile, picture: file }));
        setProfilePicturePreview(URL.createObjectURL(file));
        updateImageField('picture', file);
    };

    const handleCoverPhotoChange = (file: File) => {
        setProfile(prevProfile => ({ ...prevProfile, cover_picture: file }));
        setCoverPhotoPreview(URL.createObjectURL(file));
        updateImageField('cover_picture', file);
    };

    const handleProfileUpdate = () => {
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (key === "languages") {
                const languagesForAPI = selectedLanguages.map(lang => lang.name);
                languagesForAPI.forEach(language => formData.append("languages", language));
            } else if (key === "picture" || key === "cover_picture") {
                if (profile[key as keyof Profile] instanceof File) {
                    formData.append(key, profile[key as keyof Profile] as File);
                }
            } else {
                formData.append(key, profile[key as keyof Profile] as string);
            }
        });

        authServices.updateProfile(profile.id, formData)
            .then(() => toast.success(t('profileUpdated')))
            .catch(() => toast.error(t('profileUpdateFailed')));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordReset = () => {
        authServices.setPassword({ 
            current_password: passwordData.current_password, 
            new_password: passwordData.new_password 
        })
            .then(() => {
                toast.success(t('passwordChanged'));
                setOpenPasswordModal(false);
                setPasswordData({ current_password: "", new_password: "" });
            })
            .catch(error => {
                handleApiError(error);
                toast.error(t('passwordChangeFailed'));
            });
    };

    const handleSaveAbout = (about: string) => {
        setProfile(prev => ({ ...prev, about }));

        const aboutFormData = new FormData();
        aboutFormData.append('about', about);
        authServices.updateProfile(profile.id, aboutFormData)
            .then(() => toast.success(t('profileUpdated')))
            .catch(() => toast.error(t('profileUpdateFailed')));
    };

    const handleDeactivateAccount = () => {
        authServices.deleteAccount({ current_password: deactivatePassword })
            .then(() => {
                toast.success(t('accountDeleted'));
                Cookies.remove("accessToken", { path: "/" });
                Cookies.remove("refreshToken", { path: "/" });
                dispatch(clearProfile());
                navigate('/');
            })
            .catch(error => {
                handleApiError(error);
            });

        setOpenDeactivateModal(false);
    };

    const handleForgotPassword = async (email: string) => {
        try {
            await authServices.forgotPassword({ email });
            toast.success(t('forgotPasswordEmailSent'));
        } catch (error) {
            handleApiError(error);
            throw error; // Re-throw to let the modal handle it
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '80vh' 
            }}>
                <Typography>{t('loading')}</Typography>
            </Container>
        );
    }

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 2, sm: 3 }
            }}
        >
            <Paper 
                elevation={0} 
                sx={{ 
                    borderRadius: { xs: 2, sm: 3 }, 
                    overflow: 'hidden', 
                    mb: { xs: 2, sm: 4 },
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                {/* Cover Photo Section */}
                <CoverPhotoSection
                    coverPhoto={coverPhotoPreview}
                    onCoverPhotoChange={handleCoverPhotoChange}
                    isCurrentUser={isCurrentUser}
                />

                <Box sx={{ p: { xs: 2, sm: 3 }, pt: 0, position: 'relative' }}>
                    {/* Profile Picture */}
                    <ProfileAvatar
                        profilePicture={profilePicturePreview}
                        onProfilePictureChange={handleProfilePictureChange}
                        isCurrentUser={isCurrentUser}
                    />

                    {/* User Name */}
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mt: 2, 
                            fontWeight: 'bold',
                            fontSize: { xs: '1.75rem', sm: '2.125rem' },
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        {user.name}
                    </Typography>

                    {/* Tabs */}
                    <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant={isCurrentUser ? "scrollable" : "fullWidth"}
                            scrollButtons={isCurrentUser ? "auto" : false}
                            allowScrollButtonsMobile={isCurrentUser}
                            sx={{
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 500,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    minHeight: { xs: 40, sm: 48 },
                                    px: { xs: 1, sm: 2 },
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    },
                                },
                                '& .MuiTabs-scrollButtons': {
                                    display: { xs: isCurrentUser ? 'flex' : 'none', sm: 'none' },
                                },
                            }}
                        >
                            <Tab label={t('profile')} />
                            <Tab label={t('about')} />
                            {isCurrentUser && <Tab label={t('settings')} />}
                            {isCurrentUser && <Tab label={t('notifications')} />}
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    {activeTab === 0 && (
                        <ProfileTab
                            user={user}
                            profile={profile}
                            languages={languages}
                            selectedLanguages={selectedLanguages}
                            isCurrentUser={isCurrentUser}
                            onProfileChange={handleProfileChange}
                            onLanguagesChange={setSelectedLanguages}
                            onProfileUpdate={handleProfileUpdate}
                            t={t}
                        />
                    )}

                    {activeTab === 1 && (
                        <AboutTab
                            profile={profile}
                            isCurrentUser={isCurrentUser}
                            onSaveAbout={handleSaveAbout}
                            t={t}
                        />
                    )}

                    {isCurrentUser && activeTab === 2 && (
                        <SettingsTab
                            onOpenPasswordModal={() => setOpenPasswordModal(true)}
                            onOpenDeactivateModal={() => setOpenDeactivateModal(true)}
                            onOpenForgotPasswordModal={() => setOpenForgotPasswordModal(true)}
                            t={t}
                        />
                    )}

                    {isCurrentUser && activeTab === 3 && (
                        <Box sx={{ pt: 3 }}>
                            <NotificationPreferences />
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Modals - Only for current user */}
            {isCurrentUser && (
                <>
                    <ProfileModals
                        openPasswordModal={openPasswordModal}
                        passwordData={passwordData}
                        onClosePasswordModal={() => setOpenPasswordModal(false)}
                        onPasswordChange={handlePasswordChange}
                        onPasswordReset={handlePasswordReset}
                        openDeactivateModal={openDeactivateModal}
                        deactivatePassword={deactivatePassword}
                        onCloseDeactivateModal={() => setOpenDeactivateModal(false)}
                        onDeactivatePasswordChange={setDeactivatePassword}
                        onDeactivateAccount={handleDeactivateAccount}
                        t={t}
                    />

                    <ForgotPasswordModal
                        open={openForgotPasswordModal}
                        onClose={() => setOpenForgotPasswordModal(false)}
                        onSubmit={handleForgotPassword}
                        t={t}
                    />
                </>
            )}
        </Container>
    );
};

export default ProfileDetail;