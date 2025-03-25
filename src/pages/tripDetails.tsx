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


// Main component
const TripDetails = () => {
    const theme = useTheme();
    const { id } = useParams<{ id: string }>();
    const profile = useAppSelector((s) => s.profile);
    const accessToken = Cookies.get('accessToken');
    const navigate = useNavigate();
    const [postData, setPostdata] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        setLoading(true);
        postServices.getPost(Number(id))
            .then(response => {
                setPostdata(response.data);
                setLoading(false);
            })
            .catch(error => {
                toast.error('Could not find your post');
                setLoading(false);
            });
    }, [id]);

    const handleEdit = () => {
        navigate(`/edit/post/${postData?.id}`);
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
                        Loading travel details...
                    </Typography>
                </Container>
            </Box>
        );
    }

    // Render either mobile or desktop view based on screen size
    return (
        <>
            {isMobile ? (
                <TripDetailMobileView
                    postData={postData}
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
                    postData={postData}
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