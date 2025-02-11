import {
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
import { useState } from "react";
import Grid from "@mui/material/Grid2";
import authServices from "../redux/api/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authStyles, login } from "./styles";

const initialValues = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  re_password: "",
  picture: "",
  phone: "",
  gender: "",
  age:"",
};
const RegisterPage = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [onMouse, setOnMouse] = useState(false);
  const [menuItemImg, setMenuItemImg] = useState("");
  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    // If the input is of type 'file', store the file(s)
    const newValue = files ? files[0] : value;

    setValues({
      ...values,
      [name]: newValue,
    });

    // Call validations (exclude file validations if not needed)
    validations({
      [name]: newValue,
    });
  };

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

    // Confirm Password validation (match with password)
    if ("re_password" in fieldValue) {
      temp.re_password = fieldValue.re_password
        ? fieldValue.re_password === values.password
          ? ""
          : "Passwords do not match"
        : "Please confirm your password";
    }

    // Gender validation (required)
    if ("gender" in fieldValue) {
      temp.gender = fieldValue.gender ? "" : "Gender is required";
    }
    if ("first_name" in fieldValue) {
      temp.first_name = fieldValue.first_name ? "" : "This field is required";
    }
    if ("last_name" in fieldValue) {
      temp.last_name = fieldValue.last_name ? "" : "This field is required";
    }

    if ("phone" in fieldValue) {
      temp.phone = fieldValue.phone
        ? /^\+[1-9]\d{1,14}$/.test(fieldValue.phone)
          ? ""
          : "Please enter a valid phone number in international format (e.g., +4917651751892)"
        : "Phone number is required";
    }

    setErrors({
      ...temp,
    });

    // Return true if all errors are empty
    return Object.values(temp).every((x) => x === "");
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    const fileSize = file.size / (1024 * 1024);
    if (fileSize > 3) {
      return;
    }

    setMenuItemImg(file);
  };
  const handleSubmit = async () => {
    try {
      const datas = {
        email: values.email,
        password: values.password,
        re_password: values.re_password,
        "profile.gender": values.gender,
        "profile.picture": menuItemImg,
        "profile.phone": values.phone,
        name: values.first_name + values.last_name,
        age : values.age,
      };

      console.log(datas)

      if (validations()) {
        setIsLoading(true);
        const res = await authServices.signUp(datas);
        if (res.status === 201) {
          toast.success("Verification email has been sent to your email");
          setIsLoading(false);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error?.errors[0]?.detail);
    }
  };
  return (
    <Box sx={{ overflow: "auto", height: "100vh" }}>
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
                    Sign Up
                  </Typography>
                </Box>
                <Box sx={authStyles.IocnMainWrapper}>
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
                </Box>
                <Box mt={2}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: ".5rem", md: ".7rem" },
                    }}
                  >
                    have account?{" "}
                    <span>
                      <a
                        style={{ textDecoration: "none", color: "blue" }}
                        href="/login"
                      >
                        Login Now
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
            <Box sx={authStyles.formWrapper}>
              <Grid container spacing={2} sx={{ padding: "0rem 2rem" }}>
                <Grid
                  size={12}
                  sx={{ justifyContent: "center", display: "flex" }}
                >
                  <Box
                    sx={authStyles.userProfile}
                    onMouseOver={() => setOnMouse(true)}
                    onMouseOut={() => setOnMouse(false)}
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
                      <Box sx={authStyles.userProfile2}>
                        <label htmlFor="menuItemImg">
                          {" "}
                          <Iconify
                            width={40}
                            icon="material-symbols-light:upload-rounded"
                          />
                        </label>

                        <input
                          type="file"
                          id="menuItemImg"
                          name="menuItemImg"
                          value=""
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </Box>
                    )}
                    {/* {!menuItemImg && (
                        <label htmlFor="menuItemImg">Click to upload</label>
                      )} */}
                    {onMouse && (
                      <Box sx={authStyles.userProfile2}>
                        <label htmlFor="menuItemImg">
                          {" "}
                          <Iconify
                            width={40}
                            icon="material-symbols-light:upload-rounded"
                          />
                        </label>

                        <input
                          type="file"
                          id="menuItemImg"
                          name="menuItemImg"
                          value=""
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />
                      </Box>
                    )}
                  </Box>{" "}
                  <input
                    type="file"
                    id="menuItemImg"
                    name="menuItemImg"
                    value=""
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      First Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="first_name"
                      helperText={errors?.first_name}
                      value={values?.first_name}
                      error={Boolean(errors?.first_name)}
                      onChange={handleOnChange}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Last Name
                    </Typography>
                    <TextField
                      fullWidth
                      name="last_name"
                      helperText={errors?.last_name}
                      value={values?.last_name}
                      error={Boolean(errors?.last_name)}
                      onChange={handleOnChange}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
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
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Age
                    </Typography>
                    <TextField
                      fullWidth
                      name="age"
                      helperText={errors?.age}
                      value={values?.age}
                      error={Boolean(errors?.age)}
                      onChange={handleOnChange}
                      type="number"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Phone Number
                    </Typography>
                    <TextField
                      fullWidth
                      name="phone"
                      helperText={errors?.phone}
                      value={values?.phone}
                      error={Boolean(errors?.phone)}
                      onChange={handleOnChange}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Gender
                    </Typography>
                    <TextField
                      select
                      fullWidth
                      name="gender"
                      helperText={errors?.gender}
                      value={values?.gender}
                      error={Boolean(errors?.gender)}
                      onChange={handleOnChange}
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
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
                    <Typography sx={{ paddingLeft: "10px", fontSize: "14px" }}>
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="re_password"
                      helperText={errors?.re_password}
                      value={values?.re_password}
                      error={Boolean(errors?.re_password)}
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={handleOnChange}
                      slotProps={{
                        input: {
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
                        },
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
                >
                  {isLoading ? "loading..." : "Sign Up"}
                </Button>
              </Box>
              <Box
                sx={{
                  padding: { md: "0rem 10rem", xs: "0rem 1rem" },
                  display: { xs: "block", md: "none" },
                }}
              >
                <Box sx={authStyles.IocnMainWrapper}>
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
                </Box>
                <Box mt={2}>
                  <Typography
                    sx={{
                      textAlign: "center",
                      fontSize: { xs: ".5rem", md: ".7rem" },
                    }}
                  >
                    have account?{" "}
                    <span>
                      <a
                        style={{ textDecoration: "none", color: "blue" }}
                        href="/login"
                      >
                        Login Now
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
