import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    LinearProgress,
    useMediaQuery,
    Fab,
} from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';
import postServices from '../redux/api/postService';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useAppSelector } from '../redux/store';
import JoinTripRequestModal from '../components/tripRequestModal';
import { useTheme } from "@mui/material/styles";
import TripDetailDesktopView from '../components/tripDetailComponents.tsx/tripDetailDesktopView';
import TripDetailMobileView from '../components/tripDetailComponents.tsx/tripDetailMobileView';
import { useTranslation } from 'react-i18next';
import { getTranslatedArray, tourTypes, accommodationTypes } from "../Constants"; // Import helper and constants
import { Helmet } from 'react-helmet';

// Main component
const TripDetails = () => {
    const theme = useTheme();
    const { slug } = useParams<{ slug: string }>();
    const profile = useAppSelector((s) => s.profile);
    const accessToken = Cookies.get('accessToken');
    const navigate = useNavigate();
    const [postData, setPostdata] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('tripdetails');
    
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const translatedTourTypes = getTranslatedArray({ en: tourTypes, de: tourTypes });
    const translatedAccommodationTypes = getTranslatedArray({ en: accommodationTypes, de: accommodationTypes });

    useEffect(() => {
        setLoading(true);
        postServices.getPost(slug)
            .then(response => {
                setPostdata(response.data);
                setLoading(false);
            })
            .catch(error => {
                toast.error(t('error'));
                setLoading(false);

            });
    }, [slug]);

    const handleEdit = () => {
        navigate(`/edit/post/${postData?.slug}`);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ mt: 12 }}>
                <Container>
                    <LinearProgress />
                    <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
                        {t('loading')}
                    </Typography>
                </Container>
            </Box>
        );
    }

    // Render either mobile or desktop view based on screen size
    return (
        <>
        <Helmet>
        <title>{postData?.title} | Zusammenreisen</title>
        <meta property="og:title" content={postData?.title} />
        <meta property="og:description" content={postData?.description.slice(0, 150)} />
        <meta property="og:image" content={postData?.images[0]} />
        <meta property="og:url" content={`https://zusammenreisen.com/posts/${postData?.slug}`} />
        <meta property="og:type" content="website" />
      </Helmet>

            {isMobile ? (
                
                <TripDetailMobileView
                    postData={{
                        ...postData,
                        tour_type: translatedTourTypes[tourTypes.indexOf(postData?.tour_type)] || postData?.tour_type,
                        accommodation_type: translatedAccommodationTypes[accommodationTypes.indexOf(postData?.accommodation_type)] || postData?.accommodation_type,
                    }}
                    profile={profile}
                    accessToken={accessToken}
                    navigate={navigate}
                    handleEdit={handleEdit}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setOpenModal={setOpenModal}
                />
            ) : (
                <TripDetailDesktopView
                    postData={{
                        ...postData,
                        tour_type: translatedTourTypes[tourTypes.indexOf(postData?.tour_type)] || postData?.tour_type,
                        accommodation_type: translatedAccommodationTypes[accommodationTypes.indexOf(postData?.accommodation_type)] || postData?.accommodation_type,
                    }}
                    profile={profile}
                    accessToken={accessToken}
                    navigate={navigate}
                    handleEdit={handleEdit}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setOpenModal={setOpenModal}
                />
            )}

            <JoinTripRequestModal 
                open={openModal} 
                handleClose={() => setOpenModal(false)} 
                tripDetails={postData} 
            />
        </>
    );
};

export default TripDetails;