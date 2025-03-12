import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, Box } from "@mui/material";
import axios from "axios";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import LanguageSelector from "../components/language";
import { handleApiError } from "../redux/api/http-common";
import Navbar from "../components/navbar";
import { CloudUpload } from "@mui/icons-material";

const ProfilePage = () => {
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
                toast("Couldn't get your profile data");
            });

        authServices.getAllLanguages()
            .then(response => setLanguages(response.data))
            .catch(() => toast("Couldn't fetch languages"));
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
            .then(() => toast("Profile successfully updated"))
            .catch(() => toast("Could not update profile. Please contact support."));
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordReset = () => {
        authServices.setPassword({ current_password: passwordData.current_password, new_password: passwordData.new_password })
            .then(() => {
                toast("Password changed successfully");
                setOpenPasswordModal(false);
            })
            .catch(error => {
                handleApiError(error);
                toast("Password could not be changed. Please contact an administrator.");
            });
    };

    if (!profile.id) return <p>Loading...</p>;

    return (
        <>
            <Box sx={{ background: "#000", top: "0", left: "0", right: "0", height: "100px" }}>
                <Navbar />
            </Box>

            <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
                <h2>Profile</h2>
                
                {/* Profile Picture Upload */}
                <div style={{ position: "relative", display: "inline-block", cursor: "pointer" }}>
                    <img 
                        src={previewImage} 
                        alt="Profile" 
                        style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover" }} 
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ display: "none" }} 
                        id="fileUpload"
                    />
                    <label htmlFor="fileUpload" style={{
                        position: "absolute", 
                        bottom: 0, 
                        right: 0, 
                        background: "rgba(0, 0, 0, 0.5)", 
                        color: "white", 
                        borderRadius: "50%", 
                        padding: "8px", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <CloudUpload fontSize="small" />
                    </label>
                </div>

                <TextField fullWidth label="Name" value={user.name} disabled margin="normal" />
                <TextField fullWidth label="Email" value={user.email} disabled margin="normal" />
                <TextField fullWidth label="Age" name="age" type="number" value={profile.age} onChange={handleProfileChange} margin="normal" />
                
                <FormControl fullWidth margin="normal">
                    <InputLabel>Gender</InputLabel>
                    <Select name="gender" value={profile.gender} onChange={handleProfileChange}>
                        <MenuItem value={1}>Male</MenuItem>
                        <MenuItem value={2}>Female</MenuItem>
                        <MenuItem value={3}>Other</MenuItem>
                    </Select>
                </FormControl>

                {/* Language Selector */}
                <LanguageSelector allLanguages={languages} selectedLanguages={selectedLanguages} onLanguagesChange={setSelectedLanguages} />

                <Button variant="contained" color="primary" onClick={handleProfileUpdate} style={{ margin: "10px 0" }}>Save Changes</Button>
                <Button variant="outlined" color="secondary" onClick={() => setOpenPasswordModal(true)}>Reset Password</Button>

                {/* Password Reset Modal */}
                <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogContent>
                        <TextField fullWidth label="Old Password" name="current_password" type="password" onChange={handlePasswordChange} margin="normal" />
                        <TextField fullWidth label="New Password" name="new_password" type="password" onChange={handlePasswordChange} margin="normal" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenPasswordModal(false)} color="secondary">Cancel</Button>
                        <Button onClick={handlePasswordReset} color="primary">Confirm</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default ProfilePage;
