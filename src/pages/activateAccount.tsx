import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import authServices from "../redux/api/authService";
import { useTranslation } from 'react-i18next';

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('activateaccount');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
      authServices.activateAccount({uid,token})
      .then(() => {
        setMessage(t('accountActivated'));
      })
      .catch(() => {
        setMessage(t('invalidLink'));
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
          <Typography variant="h5" color={message.includes(t('accountActivated')) ? "primary" : "error"}>
            {message}
          </Typography>
          {message.includes(t('accountActivated')) && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              style={{ marginTop: "20px" }}
            >
              {t('goToLogin')}
            </Button>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivateAccount;
