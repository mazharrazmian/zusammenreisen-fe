import { Box, Button, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Page404 = () => {
    const { t } = useTranslation('page404');
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Typography variant="h3">{t('pageNotFound')}</Typography>
                <Typography variant="h4">
                    <Button
                        onClick={() => navigate(-1)}
                    >
                        {t('goBack')}
                    </Button>
                </Typography>
            </Box>
        </>
    );
};

export default Page404;
