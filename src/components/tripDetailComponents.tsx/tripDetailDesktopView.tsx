import { ArrowBack, Chat as ChatIcon, DirectionsWalk } from "@mui/icons-material";
import { Button, Card, CardContent, Chip, Container, Grid, Typography } from "@mui/material";
import TourDetailImageGallery from "./tripDetailImageGallery";
import TripDetailsTabsComponent from "./tripDetailTabs";
import TripSummaryCardComponent from "./tripSummaryCardComponent";
import ProfileCardComponent from "./profileCardComponent";
import { getTripTypeIcons } from "../../Constants";
import { useTranslation } from "react-i18next";

const TripDetailDesktopView = ({ 
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
    
    // Determine which button to show based on user status
    const renderCardContent = () => {
        // Flow 1: User is not logged in
        if (accessToken === undefined) {
            return (
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        {t('interested')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {t('loginToSend')}
                    </Typography>
                    <Button
                        color="primary"
                        variant="outlined"
                        startIcon={<ChatIcon />}
                        onClick={() => navigate('/login')}
                        fullWidth
                    >
                        {t('loginToSend')}
                    </Button>
                </CardContent>
            );
        }
        
        // Flow 2.1: User is participant of this trip
        if (postData?.participants?.includes(profile?.profile?.profile?.id)) {
            return (
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        {t('alreadyMember')}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        {t('checkoutPlanning')}
                    </Typography>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DirectionsWalk />}
                        onClick={() => navigate(`/tripplanner/${postData?.id}`)}
                        fullWidth
                    >
                        {t('planYourTrip')}
                    </Button>
                </CardContent>
            );
        }
        
        // Flow 2.2: User is logged in but not a participant
        return (
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    {t('interested')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    {t('sendRequestDesc', { name: postData?.posted_by?.user?.name })}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ChatIcon />}
                    onClick={() => setOpenModal(true)}
                    fullWidth
                >
                    {t('sendRequest')}
                </Button>
            </CardContent>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 6 }}>
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
            </Typography>

            {/* Main content grid */}
            <Grid container spacing={3}>
                {/* Left column - Gallery + Details */}
                <Grid item xs={12} md={8}>
                    <TourDetailImageGallery images={postData?.images} />
                    <TripDetailsTabsComponent postData={postData} activeTab={activeTab} handleTabChange={handleTabChange} />
                </Grid>

                {/* Right column - User Profile & Trip Summary */}
                <Grid item xs={12} md={4}>
                    <ProfileCardComponent postData={postData} profile={profile} handleEdit={handleEdit} />
                    <TripSummaryCardComponent postData={postData} />

                    {/* Call to Action - only shown if user is not the post owner */}
                    {postData?.posted_by?.user.email !== profile?.profile?.email && (
                        <Card elevation={2}>
                           {renderCardContent()}
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default TripDetailDesktopView;