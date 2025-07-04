import {
    Autocomplete,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import Iconify from "../components/iconify";
import vector1 from "../assets/Vector1.png";
import vector2 from "../assets/vector2.png";
import vector3 from "../assets/Vector3.png";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authStyles, login } from "./styles";
import LanguageSelector from "../components/language";
import { ArrowBack } from "@mui/icons-material";
import { useTranslation } from 'react-i18next';
import EmailVerificationModal from "../components/shared/emailVerificationModal/emailVerificationModal";

const initialValues = {
    name: "",
    email: "",
    password: "",
    re_password: "",
    picture: "",
    phone: "",
    gender: "",
    age: "",
};




const RegisterPage = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState(initialValues);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [onMouse, setOnMouse] = useState(false);
    const [menuItemImg, setMenuItemImg] = useState("");
    const [languages, setLanguages] = useState([])
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const { t } = useTranslation('register');

    useEffect(() => {

        authServices.getAllLanguages().then(response => {
            setLanguages(response.data)
        })

    }, [])


    const handleOnChange = (e) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : value;
        setValues({
            ...values,
            [name]: newValue,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size / (1024 * 1024);
        if (fileSize > 3) {
            return;
        }
        setMenuItemImg(file);
    };

    const handleModalConfirm = () => {
    navigate("/login");
  };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData();

            // Append simple fields
            formData.append('email', values.email);
            formData.append('password', values.password);
            formData.append('re_password', values.re_password);
            formData.append('name', values.name);

            // Append nested profile fields
            formData.append('profile.gender', values.gender);
            formData.append('profile.phone', values.phone);
            formData.append('profile.age', values.age);

            // Append the image file (if it exists)
            if (menuItemImg) {
                formData.append('profile.picture', menuItemImg);
            }

            // Append languages as separate fields
            selectedLanguages.forEach((language, index) => {
                formData.append('languages', language.name); // Use 'languages' without []
            });
            setIsLoading(true);

            const res = await authServices.signUp(formData);
            if (res.status === 201) {
                setShowVerificationModal(true); // Show modal
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            // Check if the error is a validation error
            if (error.response?.data?.type === "validation_error") {
                // Initialize an empty errors object
                const fieldErrors = {};

                // Map backend errors to their respective fields
                error.response.data.errors.forEach((err) => {
                    // Convert backend field names to frontend field names
                    const fieldName = err.attr.replace("profile.", ""); // Remove "profile." prefix
                    if (fieldName == 'languages'){
                        toast.error("You must select the languages")
                    }
                    fieldErrors[fieldName] = err.detail; // Set the error message
                });

                // Update the errors state
                setErrors(fieldErrors);
            } else {
                // If it's not a validation error, show a general error message
                toast.error(error.message || "An error occurred. Please try again.");
            }
        }
    };


    return (
        <Box sx={{ overflow: "auto", height: "100vh" }}>
            <EmailVerificationModal
            open={showVerificationModal}
            onClose={() => setShowVerificationModal(false)}
            onConfirm={handleModalConfirm}
            userEmail={values.email}
        />
            <Box sx={authStyles.vector1}>
                <img src={vector1} alt="" />
            </Box>
            <Box sx={authStyles.vector2}>
                <img src={vector2} alt="" />
            </Box>
            <Box sx={authStyles.vector3}>
                <img src={vector3} alt="" />
            </Box>
            <Box sx={authStyles.mainWrapper}>
                <Grid container>
                    <Grid size={{ xs: 0, md: 6 }}>
                        <Box sx={authStyles.registerImage}>
                            <Box sx={authStyles.imageTextWrapper}>
                                <Box>
                                    <Typography variant="h2" color="#fff">
                                        {t('signUp')}
                                    </Typography>
                                </Box>
                                <Box sx={authStyles.IocnMainWrapper}>
                                    {/* <Box sx={authStyles.IconWrapper}>
                                        <IconButton>
                                            <Iconify width={18} icon="flat-color-icons:google" />
                                        </IconButton>
                                    </Box> */}
                                    {/* <Box sx={authStyles.IconWrapper}>
                                        <IconButton>
                                            <Iconify width={18} icon="logos:facebook" />
                                        </IconButton>
                                    </Box> */}
                                </Box>
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                            fontSize: { xs: ".5rem", md: ".7rem" },
                                        }}
                                    >
                                        {t('haveAccount')} {" "}
                                        <span>
                                            <a
                                                style={{ textDecoration: "none", color: "blue" }}
                                                href="/login"
                                            >
                                                {t('loginNow')}
                                            </a>
                                        </span>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid
                        size={{ xs: 12, md: 6 }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Box component={'form'} sx={authStyles.formWrapper}>
                            <Button 
                                startIcon={<ArrowBack />}
                                onClick={() =>  navigate("/")}
                                sx={{ mb: 2 }}
                                >
                                {t('checkoutTours')}
                            </Button>
                            <Grid container spacing={2} sx={{ padding: "0rem 2rem" }}>
                                <Grid size={12} sx={{ justifyContent: "center", display: "flex" }}>
                                    <label htmlFor="menuItemImg" style={{ width: "100%", height: "100%", cursor: "pointer" }}>
                                        <Box
                                            sx={authStyles.userProfile}
                                            onMouseOver={() => setOnMouse(true)}
                                            onMouseOut={() => setOnMouse(false)}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {menuItemImg ? (
                                                <img
                                                    src={
                                                        menuItemImg instanceof Blob
                                                            ? URL.createObjectURL(menuItemImg)
                                                            : `${IMAGE_BASEURL}${menuItemImg}`
                                                    }
                                                    alt="menuItemImg"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <Box sx={authStyles.userProfile2} display="flex" alignItems="center" justifyContent="center">
                                                    <Iconify width={40} icon="material-symbols-light:upload-rounded" />
                                                </Box>
                                            )}
                                        </Box>
                                        <input
                                            type="file"
                                            id="menuItemImg"
                                            name="menuItemImg"
                                            onChange={handleFileChange}
                                            style={{ display: "none" }}
                                        />
                                    </label>
                                </Grid>


                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('name')}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="name"
                                            value={values?.name}
                                            onChange={handleOnChange}
                                            required
                                            error={Boolean(errors.name)}
                                            helperText={errors.name}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('email')}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="email"
                                            value={values?.email}
                                            onChange={handleOnChange}
                                            required
                                            type="email"
                                            error={Boolean(errors.email)}
                                            helperText={errors.email}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('age')}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="age"
                                            value={values?.age}
                                            onChange={handleOnChange}
                                            type="number"
                                            error={Boolean(errors.age)}
                                            helperText={errors.age}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('languages')}
                                        </Typography>
                                        <LanguageSelector selectedLanguages={selectedLanguages} allLanguages={languages} onLanguagesChange={setSelectedLanguages} />
                                    </Box>
                                </Grid>


                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('gender')}
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            name="gender"
                                            value={values?.gender}
                                            onChange={handleOnChange}
                                            required
                                            error={Boolean(errors.gender)}
                                            helperText={errors.gender}
                                        >
                                            <MenuItem value="1">Male</MenuItem>
                                            <MenuItem value="2">Female</MenuItem>
                                            <MenuItem value="3">Other</MenuItem>
                                        </TextField>
                                    </Box>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('password')}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="password"
                                            value={values?.password}
                                            onChange={handleOnChange}
                                            required
                                            type={showPassword ? "text" : "password"}
                                            error={Boolean(errors.password)}
                                            helperText={errors.password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            <Iconify
                                                                icon={
                                                                    showPassword
                                                                        ? "eva:eye-fill"
                                                                        : "eva:eye-off-fill"
                                                                }
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Box>
                                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                                            {t('confirmPassword')}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            name="re_password"
                                            value={values?.re_password}
                                            onChange={handleOnChange}
                                            required
                                            type={showConfirmPassword ? "text" : "password"}
                                            error={Boolean(errors.re_password)}
                                            helperText={errors.re_password}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() =>
                                                                setShowConfirmPassword(!showConfirmPassword)
                                                            }
                                                            edge="end"
                                                        >
                                                            <Iconify
                                                                icon={
                                                                    showConfirmPassword
                                                                        ? "eva:eye-fill"
                                                                        : "eva:eye-off-fill"
                                                                }
                                                            />
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                            <Box>
                                <Button
                                    onClick={handleSubmit}
                                    variant="contained"
                                    fullWidth
                                    sx={authStyles.submitBtn}
                                    type="submit"
                                >
                                    {isLoading ? t('loading') : t('signUp')}
                                </Button>
                            </Box>
                            <Box
                                sx={{
                                    padding: { md: "0rem 10rem", xs: "0rem 1rem" },
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {/* <Box sx={authStyles.IocnMainWrapper}>
                                    <Box sx={authStyles.IconWrapper}>
                                        <IconButton>
                                            <Iconify width={18} icon="flat-color-icons:google" />
                                        </IconButton>
                                    </Box>
                                    <Box sx={authStyles.IconWrapper}>
                                        <IconButton>
                                            <Iconify width={18} icon="logos:facebook" />
                                        </IconButton>
                                    </Box>
                                </Box> */}
                                <Box mt={2}>
                                    <Typography
                                        sx={{
                                            textAlign: "center",
                                            fontSize: { xs: ".5rem", md: ".7rem" },
                                        }}
                                    >
                                        {t('haveAccount')} {" "}
                                        <span>
                                            <a
                                                style={{ textDecoration: "none", color: "blue" }}
                                                href="/login"
                                            >
                                                {t('loginNow')}
                                            </a>
                                        </span>
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RegisterPage;