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
import { useState } from "react";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { authStyles, login } from "./styles";
import { useDispatch } from "react-redux";
import { get_profile } from "../redux/slice/profileSlice";
import Navbar from "../components/navbar";
import { ArrowBack } from "@mui/icons-material";
const initialValues = {
  email: "",
  password: "",
};
const LoginPage = () => {
    const dispatch = useDispatch()
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // If the input is of type 'file', store the file(s)
    const newValue = value;

    setValues({
      ...values,
      [name]: newValue,
    });

    // Call validations (exclude file validations if not needed)
    validations({
      [name]: newValue,
    });
  };


  const handleForgotPassword = ()=>{
   
    authServices.forgotPassword({email:values.email})
    .then(response=>{
        if (response.status == 204){
            toast("A Password Reset Email has been set to your Email Account. Please follow the instructions there.")
        }

        else if (response.status == 400){
            setErrors({'email':'Please enter a valid email address'})
            toast("Please write your email in the email field above, and click 'Forgot Password' again")
        }
    })
    .catch(error=>{
        setErrors({'email':'Please enter a valid email address'})
        toast("There was an error sending you an email. Please write your email above and click Forgot Password again")
    })
    
  }

  const validations = (fieldValue = values) => {
    const temp = { ...errors };

    // Email validation (format and required)
    if ("email" in fieldValue) {
      temp.email = fieldValue.email
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue.email)
          ? ""
          : "Please enter a valid email address"
        : "Email is required";
    }

    // Password validation (minimum length and required)
    if ("password" in fieldValue) {
      temp.password = fieldValue.password
        ? fieldValue.password.length >= 6
          ? ""
          : "Password must be at least 6 characters long"
        : "Password is required";
    }

    setErrors({
      ...temp,
    });

    // Return true if all errors are empty
    return Object.values(temp).every((x) => x === "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
          dispatch(get_profile())
          navigate("/");
          toast.success("Login successful");
          setIsLoading(false);
        }
      }
    } catch (error) {
      // console.log(error?.response?.data?.errors[0]?.detail);

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
            <Box>
                
              <Box sx={authStyles.formWrapper}>
              <Button 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
        >
          Back to Homepage
        </Button>
                <Box>
                  <Typography variant="h2" textAlign={"center"}>
                    Welcome
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { md: ".7rem", xs: ".5rem" },
                      textAlign: "center",
                    }}
                  >
                    Login with email
                  </Typography>
                </Box>
                <Box sx={authStyles.form}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Email
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
                      Password
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
                      <Button variant="text" 
                      onClick={()=>handleForgotPassword()}
                      >Forgot Password?
                      </Button>
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={authStyles.submitBtn}
                    type="submit"
                  >
                    {isLoading ? "loading..." : "Login"}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ padding: { md: "0rem 10rem", xs: "0rem 1rem" } }}>
                <Divider>or</Divider>
              </Box>
              <Box sx={authStyles.IocnMainWrapper}>
                {/* Uncomment below for Facebook and Google login icons */}
                {/* <Box sx={authStyles.IconWrapper}>
                  <IconButton>
                    <Iconify width={18} icon="flat-color-icons:google" />
                  </IconButton>
                </Box>
                <Box sx={authStyles.IconWrapper}>
                  <IconButton>
                    <Iconify width={18} icon="logos:facebook" />
                  </IconButton>
                </Box> */}
              </Box>
              <Box mt={2} mb={4}>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: { xs: ".5rem", md: ".7rem" },
                  }}
                >
                  Don’t have account?{" "}
                  <span>
                    <a
                      style={{ textDecoration: "none", color: "blue" }}
                      href="/register"
                    >
                      Sign Up
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
