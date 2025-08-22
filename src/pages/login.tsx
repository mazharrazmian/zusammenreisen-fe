import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Iconify from "../components/iconify";
import vector1 from "../assets/Vector1.png";
import vector2 from "../assets/vector2.png";
import vector3 from "../assets/Vector3.png";
import { useState, useEffect } from "react";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { authStyles } from "./styles";
import { useDispatch } from "react-redux";
import { get_profile } from "../redux/slice/profileSlice";
import { useTranslation } from 'react-i18next';
import GoogleOAuthButton from "../components/shared/googleOauth/GoogleOAuthButton";

const initialValues = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const { t } = useTranslation('login');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user was trying to access, default to home page
  const from = location.state?.from || "/";

  console.log(from)

  useEffect(() => {
    // If user is already logged in, redirect them
    const token = Cookies.get("accessToken");
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    const newValue = value;

    setValues({
      ...values,
      [name]: newValue,
    });

    validations({
      [name]: newValue,
    });
  };

  const handleForgotPassword = () => {
    authServices.forgotPassword({ email: values.email })
      .then(response => {
        if (response.status == 204) {
          toast.success(t('passwordResetEmailSent'));
        } else if (response.status == 400) {
          setErrors({ 'email': t('validEmailRequired') });
          toast.error(t('enterEmailAndClickForgotPassword'));
        }
      })
      .catch(error => {
        setErrors({ 'email': t('validEmailRequired') });
        toast.error(t('errorSendingEmail'));
      });
  };

  const validations = (fieldValue = values) => {
    const temp = { ...errors };

    if ("email" in fieldValue) {
      temp.email = fieldValue.email
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue.email)
          ? ""
          : t('validEmailRequired')
        : t('emailRequired');
    }

    if ("password" in fieldValue) {
      temp.password = fieldValue.password
        ? fieldValue.password.length >= 6
          ? ""
          : t('passwordMinLength')
        : t('passwordRequired');
    }

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const datas = {
        email: values.email,
        password: values.password,
      };

      if (validations()) {
        setIsLoading(true);
        const res = await authServices.login(datas);

        if (res.status === 200) {
          Cookies.set("userId", res.data.id, {
            path: "/",
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("accessToken", res.data.access, {
            path: "/",
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("refreshToken", res.data.refresh, {
            path: "/",
            secure: true,
            sameSite: "strict",
          });
          dispatch(get_profile());
          
          // Redirect to the page they were trying to access
          navigate(from, { replace: true });
          toast.success(t('loginSuccessful'));
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box component="form" sx={{ overflow: "auto", height: "100vh" }} onSubmit={handleSubmit}>
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
          <Grid container sx={{ height: "100%" }}>
            <Grid item xs={0} sm={6} md={6}>
              <Box sx={authStyles.loginImage} />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: "400px", px: 2 }}>
                <Box sx={authStyles.formWrapper}>
                  <Box>
                    
                    {/* Show message if user was redirected from a protected route */}
                    {from !== "/" && (
                      <Typography
                        sx={{
                          fontSize: { md: ".6rem", xs: ".5rem" },
                          textAlign: "center",
                          color: "primary.main",
                          mt: 1,
                          mb: 2,
                          fontStyle: "italic"
                        }}
                      >
                        {t('loginRequiredToAccess')} {from}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Google Sign In Section */}
                  <Box sx={{ 
                    mb: 3,
                    display: "flex", 
                    flexDirection: "column", 
                    alignItems: "center",
                    gap: 1
                  }}>
                    <Box sx={{ 
                      width: "100%", 
                      minWidth: "232px",
                      "& #google-signin-button": {
                        width: "100% !important",
                        "& > div": {
                          width: "100% !important",
                          justifyContent: "center !important"
                        }
                      }
                    }}>
                      <GoogleOAuthButton text="signin_with"/>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ 
                    width: "100%", 
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                  }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "text.secondary",
                        fontSize: { md: ".8rem", xs: ".7rem" },
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        fontWeight: 500
                      }}
                    >
                      or
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>

                  {/* Email Login Section */}
                  <Box sx={{ width: "100%" }}>
                    <Typography
                      sx={{
                        fontSize: { md: ".8rem", xs: ".7rem" },
                        textAlign: "center",
                        color: "text.secondary",
                        mb: 2,
                      }}
                    >
                      {t('loginWithEmail')}
                    </Typography>
                    
                    <Box sx={authStyles.form}>
                      <Box>
                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                          {t('email')}
                        </Typography>
                        <TextField
                          fullWidth
                          name="email"
                          helperText={errors?.email}
                          value={values?.email}
                          error={Boolean(errors?.email)}
                          onChange={handleOnChange}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                          {t('password')}
                        </Typography>
                        <TextField
                          fullWidth
                          name="password"
                          helperText={errors?.password}
                          value={values?.password}
                          error={Boolean(errors?.password)}
                          type={showPassword ? "text" : "password"}
                          onChange={handleOnChange}
                          slotProps={{
                            input: {
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
                            },
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={authStyles.forgotPass}>
                          <Button 
                            variant="text" 
                            onClick={() => handleForgotPassword()}
                            sx={{ 
                              fontSize: "12px",
                              textTransform: "none",
                              p: 0,
                              minWidth: "auto"
                            }}
                          >
                            {t('forgotPassword')}
                          </Button>
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={authStyles.submitBtn}
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? t('loading') : t('login')}
                      </Button>
                    </Box>
                  </Box>
                </Box>
                
                {/* Sign Up Link */}
                <Box sx={{ mt: 2, mb: 4 }}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: ".7rem", md: ".8rem" },
                      color: "text.secondary"
                    }}
                  >
                    {t('dontHaveAccount')} {" "}
                    <span>
                      <a
                        style={{ 
                          textDecoration: "none", 
                          color: "inherit",
                          fontWeight: 500
                        }}
                        href="/register"
                      >
                        {t('signUp')}
                      </a>
                    </span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default LoginPage;