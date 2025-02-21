import { useState, useEffect } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import axios from "axios";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import LanguageSelector from "../components/language";

const ProfilePage = () => {
    const [user, setUser] = useState({ email: "", name: "" }); // Stores only name & email
    const [profile, setProfile] = useState({ id: "", picture: "", gender: "", age: "", languages: [] }); // Stores profile data
    const [languages, setLanguages] = useState([]); // Available languages list
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ old_password: "", new_password: "" });

    useEffect(() => {
        authServices.getProfile()
            .then(response => {
                setUser({ email: response.data.email, name: response.data.name }); // Store user data separately
                setProfile(response.data.profile); // Store only profile data
            })
            .catch(() => {
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
            setProfile(prevProfile => ({ ...prevProfile, picture: file })); // Store file in state
        }
    };

    const setSelectedLanguages = (selectedLanguages) => {
        setProfile(prevProfile => ({ ...prevProfile, languages: selectedLanguages }));
    };

    const handleProfileUpdate = () => {
        const formData = new FormData();
        Object.keys(profile).forEach(key => {
            if (key === "languages") {
                profile.languages.forEach(lang => formData.append("languages[]", lang)); // Send languages as an array
            
            } 
            
            else if (key === 'picture'){
                if (typeof(profile.picture) != File){
                    return
                }
            }
            else {
                formData.append(key, profile[key]);
            }
        });
       // Display the key/value pairs
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        authServices.updateProfile(profile.id, formData)
            .then(() => toast("Profile successfully updated"))
            .catch(() => toast("Could not update profile. Please contact support."));
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordReset = () => {
        axios.post("/auth/password/change/", passwordData).then(() => setOpenPasswordModal(false));
    };

    if (!profile.id) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "500px", margin: "auto", textAlign: "center" }}>
            <h2>Profile</h2>
            <div>
                <img src={profile.picture} alt="Profile" style={{ width: 100, height: 100, borderRadius: "50%" }} />
                <input type="file" onChange={handleFileChange} style={{ display: "block", margin: "10px auto" }} />
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
            <LanguageSelector allLanguages={languages} onLanguagesChange={setSelectedLanguages} />

            <Button variant="contained" color="primary" onClick={handleProfileUpdate} style={{ margin: "10px 0" }}>Save Changes</Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenPasswordModal(true)}>Reset Password</Button>

            {/* Password Reset Modal */}
            <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Old Password" name="old_password" type="password" onChange={handlePasswordChange} margin="normal" />
                    <TextField fullWidth label="New Password" name="new_password" type="password" onChange={handlePasswordChange} margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPasswordModal(false)} color="secondary">Cancel</Button>
                    <Button onClick={handlePasswordReset} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProfilePage;
