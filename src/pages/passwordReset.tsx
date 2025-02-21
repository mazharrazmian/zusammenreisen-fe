import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://your-api.com/auth/users/reset_password_confirm/", {
        uid,
        token,
        new_password: password,
      });
      setMessage("Your password has been reset! You can now log in.");
    } catch {
      setMessage("Invalid or expired reset link.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h5" color="primary">
        Reset Your Password
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <TextField
          fullWidth
          type="password"
          label="New Password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {loading ? <CircularProgress color="primary" /> : null}

        <Typography color={message.includes("reset") ? "primary" : "error"} style={{ marginTop: "10px" }}>
          {message}
        </Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
          Reset Password
        </Button>

        {message.includes("reset") && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/login")}
            style={{ marginTop: "10px" }}
          >
            Go to Login
          </Button>
        )}
      </form>
    </Container>
  );
};

export default ResetPassword;
