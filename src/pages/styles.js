import signUpImg from "../assets/signUp.jpg";
import listPageBg from "../assets/listBg.jpg";
import loginImg from "../assets/login.png";
import homebg from "../assets/homebg.webp";

export const authStyles = {
  vector1: {
    position: "absolute",
    right: 0,
    top: "10%",
    zIndex: "-100",
    display: { xs: "none", md: "block" },
  },
  vector2: {
    position: "absolute",
    right: 0,
    zIndex: "-100",
    bottom: "0px",
    display: { xs: "none", md: "block" },
  },
  vector3: {
    position: "absolute",
    left: 0,
    zIndex: "-100",
    bottom: "0px",
    display: { xs: "none", md: "block" },
  },
  mainWrapper: {
    boxShadow: "0px 10px 20px rgba(0,0,0, .2)",
    borderRadius: "12px",
    margin: "4rem auto",
    width: { md: "70%", xs: "95%" },
    overflow: "hidden",
  },
  formWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "3rem 0rem ",
    flexDirection: "column",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },
  forgotPass: {
    fontSize: "12px",
    cursor: "pointer",
    textAlign: "right",
  },
  submitBtn: {
    minWidth: "232px",
    borderRadius: "14px",
    marginTop: "1rem",
    padding: ".6rem 0rem",
  },
  IocnMainWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    marginTop: "1rem",
  },
  IconWrapper: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: { md: ".4rem 1rem ", xs: "0rem 1rem " },
    ":hover": { border: "1px solid #000", cursor: "pointer" },
  },
  loginImage: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${loginImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "100%",
    overflow: "none",
  },
  registerImage: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5)), url(${signUpImg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    height: "100%",
    overflow: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageTextWrapper: {
    padding: { md: "0rem 10rem", xs: "0rem 1rem" },
    display: { xs: "none", md: "block" },
  },
  userProfile: {
    width: "150px",
    height: "150px",
    background: "#eeeeee",
    // boxShadow: '0 6px 24px #f1f1f1',
    borderRadius: "10rem",
    overflow: "hidden",
    border: "1px dashed #999",
    margin: "15px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  userProfile2: {
    position: "absolute",
    background: "#8888885c",
    width: "150px",
    height: "150px",
    top: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor : 'pointer',
  },
};

export const listStyles = {
  mainWrapper: {
    minHeight: { md: "80vh", xs: "60vh" },
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${listPageBg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white", // Ensures text is readable
  },
  userPostsWrapper: {
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    maxWidth: "1550px",
    margin: "auto",
    marginTop: "3rem",
    position: "relative",
    padding: "0rem 1rem",
  },
  postWrapper: {
    borderRadius: "16px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  },
  imageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    backgroundColor: "#EDEDED",
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: "#1976D2",
    color: "#fff",
    fontSize: "1.25rem",
  },
  cardContent: {
    padding: 2,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    flexGrow: 1,
  },
  postTitle: {
    fontWeight: "bold",
    color: "#333",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  detailsBtn: {
    textTransform: "capitalize",
    borderRadius: "8px",
    backgroundColor: "#1976D2",
    "&:hover": {
      backgroundColor: "#125CA1",
    },
  },
  editBtn: {
    textTransform: "capitalize",
    borderRadius: "8px",
    color: "#1976D2",
    borderColor: "#1976D2",
    "&:hover": {
      backgroundColor: "#E3F2FD",
    },
  },
};

export const homePageStyles = {
  mainWrapper: {
    minHeight: { md: "80vh", xs: "60vh" },
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.5)), url(${homebg})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
  },
  searchBox: {
    boxShadow: "0px 10px 10px rgba(0,0,0, 0.1)",
    background: "#fff",
    borderRadius: "12px",
    width: { md: "70%", sm: "80%", xs: "90%" },
    margin: "auto",
    transform: "translate(0,-50%)",
    padding: "2rem",
    marginTop: { xs: "2.5rem", md: "0rem" },
  },
};

export const addPostStyles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6rem 0rem",
  },
  imageWrapper: {
    display: "flex",
    gap: 2,
    marginTop: 2,
    flexWrap: "wrap",
    border: "1px dashed gray",
    padding: 2,
    borderRadius: 2,
  },
  imageWrapper2: {
    position: "relative",
    width: 150,
    height: 150,
    border: "2px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  IconButton: {
    position: "absolute",
    top: 8,
    right: 8,
    color: "white",
    background: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },
};

export const detailStyles = {
  notFound: {
    textAlign: "center",
    marginTop: 6,
    padding: 3,
    backgroundColor: "#FFF3E0",
    borderRadius: "16px",
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
    maxWidth: 500,
    margin: "auto",
  },
};
export const filterStyles = {
  mainWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    width: "100%",
    maxWidth: "320px",
    p: 3,
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    height: "100%",
  },
};
