import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress } from "@mui/material";
import authServices from "../redux/api/authService";
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('passwordreset');
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage(t('passwordsDoNotMatch'));
      return;
    }
    if (uid === undefined || token === undefined) return
    setLoading(true);
    try {
      await authServices.resetPasswordConfirm({uid,token,password})
      setMessage(t('passwordResetSuccess'));
    } catch {
      setMessage(t('invalidOrExpiredLink'));
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h5" color="primary">
        {t('resetYourPassword')}
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <TextField
          fullWidth
          type="password"
          label={t('newPassword')}
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          type="password"
          label={t('confirmPassword')}
          variant="outlined"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {loading ? <CircularProgress color="primary" /> : null}

        <Typography color={message.includes(t('passwordResetSuccess')) ? "primary" : "error"} style={{ marginTop: "10px" }}>
          {message}
        </Typography>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
          {t('resetPassword')}
        </Button>

        {message.includes(t('passwordResetSuccess')) && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/login")}
            style={{ marginTop: "10px" }}
          >
            {t('goToLogin')}
          </Button>
        )}
      </form>
    </Container>
  );
};

export default ResetPassword;
