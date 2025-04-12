import { Box, Typography } from "@mui/material";
import Navbar from "../components/navbar";
import { useTranslation } from 'react-i18next';

const TravelBuddyBlog = () => {
    const { t } = useTranslation('bloglist');

    return (
        <>
            <Typography variant="h3" sx={{ textAlign: 'center', marginTop: 3 }}>
                {t('comingSoon')}
            </Typography>
        </>
    );
};

export default TravelBuddyBlog;