import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import authServices from "../redux/api/authService";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    
      authServices.activateAccount({uid,token})
      .then(() => {
        setMessage("Your account has been activated! You can now log in.");
      })
      .catch(() => {
        setMessage("Invalid or expired activation link.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uid, token]);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {loading ? (
        <CircularProgress color="primary" />
      ) : (
        <>
          <Typography variant="h5" color={message.includes("activated") ? "primary" : "error"}>
            {message}
          </Typography>
          {message.includes("activated") && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              style={{ marginTop: "20px" }}
            >
              Go to Login
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivateAccount;
