import { ArrowBack, Chat as ChatIcon, DirectionsWalk } from "@mui/icons-material";
import { Button, Chip, Container, Fab, Typography } from "@mui/material";
import ProfileCardComponent from "./profileCardComponent";
import TourDetailImageGallery from "./tripDetailImageGallery";
import TripSummaryCardComponent from "./tripSummaryCardComponent";
import TripDetailsTabsComponent from "./tripDetailTabs";
import { getTripTypeIcons } from "../../Constants";
import { useTranslation } from "react-i18next";
import { Share as ShareIcon } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import ShareModal from './shareModal';
import { useState } from "react";


// Mobile component
const TripDetailMobileView = ({ 
    postData, 
    profile, 
    accessToken, 
    navigate, 
    handleEdit, 
    activeTab, 
    handleTabChange, 
    setOpenModal 
}) => {
    const { t } = useTranslation('tripdetails');
     const [openShareModal, setOpenShareModal] = useState(false);
    const shareUrl = window.location.href;
    // Determine which button to show based on user status
    const renderActionButton = () => {
        // Flow 1: User is not logged in
        if (accessToken === undefined) {
            return (
                <Fab
                    color="primary"
                    variant="extended"
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        borderRadius: 2,
                        zIndex: 1000
                    }}
                    onClick={() => navigate('/login')}
                >
                    <ChatIcon sx={{ mr: 1 }} />
                        {t('loginToSend')}
                </Fab>
            );
        }
        
        // Don't show button if the user is the owner of the post
        if (postData?.posted_by?.user.email === profile?.profile?.email) {
            return null;
        }
        
        // Trip is fully booked
        if (postData?.current_travellers >= postData?.group_size) {
            return (
                <Fab
                    color="primary"
                    variant="extended"
                    disabled
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        borderRadius: 2,
                        zIndex: 1000
                    }}
                >
                    {t('fullyBooked')}
                </Fab>
            );
        }

        // Flow 2.1: User is participant of this trip
        if (postData?.participants?.includes(profile?.profile?.profile?.id)) {
            return (
                <Fab
                    color="primary"
                    variant="extended"
                    sx={{
                        position: "fixed",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        borderRadius: 2,
                        zIndex: 1000
                    }}
                    onClick={() => navigate(`/tripplanner/${postData?.id}`)}
                >
                    <DirectionsWalk sx={{ mr: 1 }} />
                    {t("planYourTrip")}
                </Fab>
            );
        }
        
        // Flow 2.2: User is logged in but not a participant
        return (
            <Fab
                color="primary"
                variant="extended"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    borderRadius: 2,
                    zIndex: 1000
                }}
                onClick={() => setOpenModal(true)}
            >
                <ChatIcon sx={{ mr: 1 }} />
                {t('sendRequest')}
            </Fab>
        );
    };

    return (
        <Container maxWidth="lg" sx={{mb: 10, pb: 8 }}>
            {/* Title */}
            <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                {postData?.title}
                <Chip
                    label={postData?.tour_type}
                    color="primary"
                    size="small"
                    icon={getTripTypeIcons(postData?.tour_type)}
                    sx={{ ml: 2 }}
                />
                 <Tooltip title="Share this trip">
                <IconButton onClick={() => setOpenShareModal(true)} sx={{display:'inline'}}>
                    <ShareIcon />
                </IconButton>
            </Tooltip>

                <ShareModal
                open={openShareModal}
                onClose={() => setOpenShareModal(false)}
                url={shareUrl}
                title={postData?.title}
                />

            </Typography>

            {/* Profile Card */}
            <ProfileCardComponent postData={postData} profile={profile} handleEdit={handleEdit} />
            
            {/* Gallery */}
            <TourDetailImageGallery images={postData?.images} />
            
            {/* Trip Summary */}
            <TripSummaryCardComponent postData={postData} />
            
            {/* Details */}
            <TripDetailsTabsComponent postData={postData} activeTab={activeTab} handleTabChange={handleTabChange} />
            
            {/* Action button - will be rendered at the bottom */}
            {renderActionButton()}
        </Container>
    );
};

export default TripDetailMobileView